'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ValidationFieldWrapper } from './ValidationHelper';
import ImageUploader from './ImageUploader';
import { LIMITS, validateReview } from '@/lib/adminValidations';

interface ReviewEditorProps {
  reviewId?: string;
}

export default function ReviewEditor({ reviewId }: ReviewEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!reviewId);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    platform: 'Google' as 'Google' | 'TripAdvisor',
    reviewerName: '',
    reviewerAvatar: '',
    rating: 5,
    reviewText: '',
    date: new Date().toISOString().split('T')[0],
    reviewUrl: '',
    verified: false,
  });

  useEffect(() => {
    if (reviewId) {
      fetch(`/api/admin/reviews/${reviewId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            platform: data.platform,
            reviewerName: data.reviewerName,
            reviewerAvatar: data.reviewerAvatar || '',
            rating: data.rating,
            reviewText: data.reviewText,
            date: new Date(data.date).toISOString().split('T')[0],
            reviewUrl: data.reviewUrl || '',
            verified: data.verified || false,
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load review');
          setLoading(false);
        });
    }
  }, [reviewId]);

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    if (field === 'reviewerName' && value.length > LIMITS.REVIEWER_NAME) {
      newErrors[field] = `Reviewer name must be ${LIMITS.REVIEWER_NAME} characters or less`;
    } else if (field === 'reviewText' && value.length > LIMITS.REVIEW_TEXT) {
      newErrors[field] = `Review text must be ${LIMITS.REVIEW_TEXT} characters or less`;
    } else if (field === 'reviewerAvatar' && value && !/^https?:\/\/.+/.test(value)) {
      newErrors[field] = 'Must be a valid URL';
    } else if (field === 'reviewUrl' && value && !/^https?:\/\/.+/.test(value)) {
      newErrors[field] = 'Must be a valid URL';
    } else if (field === 'rating' && (value < 1 || value > 5)) {
      newErrors[field] = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const validationResult = validateReview({
      ...formData,
      reviewerAvatar: formData.reviewerAvatar || undefined,
      reviewUrl: formData.reviewUrl || undefined,
    });

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    setSaving(true);

    try {
      const url = reviewId
        ? `/api/admin/reviews/${reviewId}`
        : '/api/admin/reviews';
      const method = reviewId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (response.ok) {
        toast.success(reviewId ? 'Review updated!' : 'Review created!');
        router.push('/admin/reviews');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save review');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && setFormData({ ...formData, rating: i + 1 })}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        disabled={!interactive}
      >
        <svg
          className={`w-8 h-8 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading review...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Review Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value as 'Google' | 'TripAdvisor' })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] focus:border-[#485342] transition-all"
            >
              <option value="Google">Google</option>
              <option value="TripAdvisor">TripAdvisor</option>
            </select>
          </div>
          <div>
            <ValidationFieldWrapper
              label="Reviewer Name"
              required
              error={errors.reviewerName}
              characterCount={{ current: formData.reviewerName.length, max: LIMITS.REVIEWER_NAME }}
            >
              <input
                type="text"
                value={formData.reviewerName}
                onChange={(e) => {
                  const newName = e.target.value;
                  setFormData({ ...formData, reviewerName: newName });
                  validateField('reviewerName', newName);
                }}
                onBlur={() => validateField('reviewerName', formData.reviewerName)}
                required
                placeholder="John Doe"
                maxLength={LIMITS.REVIEWER_NAME}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.reviewerName ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <ValidationFieldWrapper label="Reviewer Avatar URL" error={errors.reviewerAvatar}>
              <input
                type="url"
                value={formData.reviewerAvatar}
                onChange={(e) => {
                  setFormData({ ...formData, reviewerAvatar: e.target.value });
                  validateField('reviewerAvatar', e.target.value);
                }}
                onBlur={() => validateField('reviewerAvatar', formData.reviewerAvatar)}
                placeholder="https://example.com/avatar.jpg"
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.reviewerAvatar ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <ImageUploader
                storageModule="reviews"
                onImageSelect={(url) => {
                  setFormData((prev) => ({ ...prev, reviewerAvatar: url }));
                  validateField('reviewerAvatar', url);
                }}
                existingImages={formData.reviewerAvatar ? [formData.reviewerAvatar] : []}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Review Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] focus:border-[#485342] transition-all"
            />
          </div>
          <div>
            <ValidationFieldWrapper label="Review URL" error={errors.reviewUrl}>
              <input
                type="url"
                value={formData.reviewUrl}
                onChange={(e) => {
                  setFormData({ ...formData, reviewUrl: e.target.value });
                  validateField('reviewUrl', e.target.value);
                }}
                onBlur={() => validateField('reviewUrl', formData.reviewUrl)}
                placeholder="https://www.google.com/maps/reviews/..."
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.reviewUrl ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="verified"
              checked={formData.verified}
              onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
              className="w-5 h-5 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
            />
            <label htmlFor="verified" className="ml-2 text-sm font-semibold text-gray-700">
              Verified Review
            </label>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Rating</h2>
        <div className="flex items-center gap-2">
          {renderStars(formData.rating, true)}
          <span className="ml-4 text-lg font-semibold text-gray-700">
            {formData.rating} out of 5 stars
          </span>
        </div>
        {errors.rating && (
          <div className="text-sm text-red-600 mt-2">{errors.rating}</div>
        )}
      </div>

      {/* Review Text */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Review Text</h2>
        <ValidationFieldWrapper
          label=""
          required
          error={errors.reviewText}
          characterCount={{ current: formData.reviewText.length, max: LIMITS.REVIEW_TEXT }}
        >
          <textarea
            value={formData.reviewText}
            onChange={(e) => {
              const newText = e.target.value;
              if (newText.length <= LIMITS.REVIEW_TEXT) {
                setFormData({ ...formData, reviewText: newText });
                validateField('reviewText', newText);
              }
            }}
            onBlur={() => validateField('reviewText', formData.reviewText)}
            required
            rows={8}
            placeholder="Write the review text here..."
            maxLength={LIMITS.REVIEW_TEXT}
            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none transition-all ${
              errors.reviewText ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
            }`}
          />
        </ValidationFieldWrapper>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-[#485342] text-white rounded-lg font-semibold hover:bg-[#3a4235] transition-colors disabled:opacity-50 disabled:cursor-not-allowed button-shadow"
        >
          {saving ? 'Saving...' : reviewId ? 'Update Review' : 'Create Review'}
        </motion.button>
      </div>
    </form>
  );
}

