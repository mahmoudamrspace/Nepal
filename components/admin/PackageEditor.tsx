'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ItineraryDayEditor from './ItineraryDayEditor';
import FAQEditor from './FAQEditor';
import ArrayEditor from './ArrayEditor';
import { ItineraryDay, FAQ } from '@/types';
import { ValidationFieldWrapper, CharacterCounter, ErrorMessage, ArrayLimitIndicator } from './ValidationHelper';
import { LIMITS, ARRAY_LIMITS, validatePackage } from '@/lib/adminValidations';

interface PackageEditorProps {
  packageId?: string;
}

export default function PackageEditor({ packageId }: PackageEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!packageId);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    currency: 'USD',
    duration: '',
    location: '',
    difficulty: 'Moderate' as const,
    groupSize: '8',
    featuredImage: '',
    images: [] as string[],
    category: 'Adventure' as const,
    featured: false,
    availableDates: [] as string[],
    itinerary: [] as ItineraryDay[],
    included: [] as string[],
    excluded: [] as string[],
    faq: [] as FAQ[],
    highlights: [] as string[],
  });

  useEffect(() => {
    if (packageId) {
      fetch(`/api/admin/packages/${packageId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || '',
            slug: data.slug || '',
            shortDescription: data.shortDescription || '',
            fullDescription: data.fullDescription || '',
            price: data.price?.toString() || '',
            currency: data.currency || 'USD',
            duration: data.duration || '',
            location: data.location || '',
            difficulty: data.difficulty || 'Moderate',
            groupSize: data.groupSize?.toString() || '8',
            featuredImage: data.featuredImage || '',
            images: data.images || [],
            category: data.category || 'Adventure',
            featured: data.featured || false,
            availableDates: data.availableDates || [],
            itinerary: (data.itinerary || []) as ItineraryDay[],
            included: data.included || [],
            excluded: data.excluded || [],
            faq: (data.faq || []) as FAQ[],
            highlights: data.highlights || [],
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load package');
          setLoading(false);
        });
    }
  }, [packageId]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    // Validate based on field
    if (field === 'name' && value.length > LIMITS.TITLE) {
      newErrors[field] = `Name must be ${LIMITS.TITLE} characters or less`;
    } else if (field === 'slug' && value.length > LIMITS.SLUG) {
      newErrors[field] = `Slug must be ${LIMITS.SLUG} characters or less`;
    } else if (field === 'slug' && !/^[a-z0-9-]+$/.test(value)) {
      newErrors[field] = 'Slug must contain only lowercase letters, numbers, and hyphens';
    } else if (field === 'shortDescription' && value.length > LIMITS.SHORT_DESCRIPTION) {
      newErrors[field] = `Short description must be ${LIMITS.SHORT_DESCRIPTION} characters or less`;
    } else if (field === 'fullDescription' && value.length > LIMITS.FULL_DESCRIPTION) {
      newErrors[field] = `Full description must be ${LIMITS.FULL_DESCRIPTION} characters or less`;
    } else if (field === 'duration' && value.length > LIMITS.DURATION) {
      newErrors[field] = `Duration must be ${LIMITS.DURATION} characters or less`;
    } else if (field === 'location' && value.length > LIMITS.LOCATION) {
      newErrors[field] = `Location must be ${LIMITS.LOCATION} characters or less`;
    } else if (field === 'price') {
      const numPrice = parseFloat(value);
      if (isNaN(numPrice) || numPrice <= 0) {
        newErrors[field] = 'Price must be a positive number';
      } else if (numPrice > 999999) {
        newErrors[field] = 'Price cannot exceed 999,999';
      }
    } else if (field === 'groupSize') {
      const numSize = parseInt(value);
      if (isNaN(numSize) || numSize < 1) {
        newErrors[field] = 'Group size must be at least 1';
      } else if (numSize > 50) {
        newErrors[field] = 'Group size cannot exceed 50';
      }
    } else if (field === 'featuredImage' && value && !/^https?:\/\/.+/.test(value)) {
      newErrors[field] = 'Must be a valid URL';
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const validationResult = validatePackage({
      ...formData,
      price: parseFloat(formData.price) || 0,
      groupSize: parseInt(formData.groupSize) || 0,
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
      const url = packageId
        ? `/api/admin/packages/${packageId}`
        : '/api/admin/packages';
      const method = packageId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          groupSize: parseInt(formData.groupSize),
        }),
      });

      if (response.ok) {
        toast.success(packageId ? 'Package updated!' : 'Package created!');
        router.push('/admin/packages');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save package');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-16 h-16 border-4 border-[#485342] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading package...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ValidationFieldWrapper
              label="Package Name"
              required
              error={errors.name}
              characterCount={{ current: formData.name.length, max: LIMITS.TITLE }}
            >
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setFormData({ ...formData, name: newName, slug: generateSlug(newName) });
                  validateField('name', newName);
                }}
                onBlur={() => validateField('name', formData.name)}
                required
                placeholder="e.g., Everest Base Camp Trek"
                maxLength={LIMITS.TITLE}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div className="md:col-span-2">
            <ValidationFieldWrapper
              label="Slug"
              required
              error={errors.slug}
              characterCount={{ current: formData.slug.length, max: LIMITS.SLUG }}
            >
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                  setFormData({ ...formData, slug: newSlug });
                  validateField('slug', newSlug);
                }}
                onBlur={() => validateField('slug', formData.slug)}
                required
                placeholder="everest-base-camp-trek"
                maxLength={LIMITS.SLUG}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.slug ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div className="md:col-span-2">
            <ValidationFieldWrapper
              label="Short Description"
              required
              error={errors.shortDescription}
              characterCount={{ current: formData.shortDescription.length, max: LIMITS.SHORT_DESCRIPTION }}
            >
              <textarea
                value={formData.shortDescription}
                onChange={(e) => {
                  const newDesc = e.target.value;
                  setFormData({ ...formData, shortDescription: newDesc });
                  validateField('shortDescription', newDesc);
                }}
                onBlur={() => validateField('shortDescription', formData.shortDescription)}
                required
                rows={3}
                placeholder="Brief description shown on package cards and hero section..."
                maxLength={LIMITS.SHORT_DESCRIPTION}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none transition-all ${
                  errors.shortDescription ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <ValidationFieldWrapper label="Price" required error={errors.price}>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  validateField('price', e.target.value);
                }}
                onBlur={() => validateField('price', formData.price)}
                required
                placeholder="1999.00"
                min="0"
                max="999999"
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.price ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] focus:border-[#485342] transition-all"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <ValidationFieldWrapper
              label="Duration"
              required
              error={errors.duration}
              characterCount={{ current: formData.duration.length, max: LIMITS.DURATION }}
            >
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => {
                  const newDuration = e.target.value;
                  setFormData({ ...formData, duration: newDuration });
                  validateField('duration', newDuration);
                }}
                onBlur={() => validateField('duration', formData.duration)}
                placeholder="14 days / 13 nights"
                required
                maxLength={LIMITS.DURATION}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.duration ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <ValidationFieldWrapper
              label="Location"
              required
              error={errors.location}
              characterCount={{ current: formData.location.length, max: LIMITS.LOCATION }}
            >
              <input
                type="text"
                value={formData.location}
                onChange={(e) => {
                  const newLocation = e.target.value;
                  setFormData({ ...formData, location: newLocation });
                  validateField('location', newLocation);
                }}
                onBlur={() => validateField('location', formData.location)}
                placeholder="e.g., Kathmandu, Nepal"
                required
                maxLength={LIMITS.LOCATION}
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.location ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] focus:border-[#485342] transition-all"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
          <div>
            <ValidationFieldWrapper label="Group Size" required error={errors.groupSize}>
              <input
                type="number"
                value={formData.groupSize}
                onChange={(e) => {
                  setFormData({ ...formData, groupSize: e.target.value });
                  validateField('groupSize', e.target.value);
                }}
                onBlur={() => validateField('groupSize', formData.groupSize)}
                required
                min="1"
                max="50"
                placeholder="8"
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.groupSize ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] focus:border-[#485342] transition-all"
            >
              <option value="Adventure">Adventure</option>
              <option value="Culture">Culture</option>
              <option value="Relaxation">Relaxation</option>
              <option value="Wellness">Wellness</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-5 h-5 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-semibold text-gray-700">
              Featured Package
            </label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Images</h2>
        <div className="space-y-4">
          <div>
            <ValidationFieldWrapper label="Featured Image URL" required error={errors.featuredImage}>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => {
                  setFormData({ ...formData, featuredImage: e.target.value });
                  validateField('featuredImage', e.target.value);
                }}
                onBlur={() => validateField('featuredImage', formData.featuredImage)}
                required
                placeholder="https://example.com/featured-image.jpg"
                className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] transition-all ${
                  errors.featuredImage ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Images
              </label>
              <ArrayLimitIndicator
                current={formData.images.length}
                max={ARRAY_LIMITS.IMAGES}
                itemName="images"
              />
            </div>
            <ArrayEditor
              items={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              label="Image URLs"
              addButtonLabel="Add Image"
              itemPlaceholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-gray-800">Highlights</h2>
          <ArrayLimitIndicator
            current={formData.highlights.length}
            max={ARRAY_LIMITS.HIGHLIGHTS}
            itemName="highlights"
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Key highlights that will be displayed on the package detail page
        </p>
        <ArrayEditor
          items={formData.highlights}
          onChange={(highlights) => setFormData({ ...formData, highlights })}
          addButtonLabel="Add Highlight"
          itemPlaceholder="e.g., Visit ancient temples and monasteries"
        />
      </div>

      {/* Overview (Full Description) */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Overview / Full Description</h2>
        <p className="text-sm text-gray-600 mb-4">
          Detailed description shown in the Overview section on the package detail page
        </p>
        <ValidationFieldWrapper
          label=""
          required
          error={errors.fullDescription}
          characterCount={{ current: formData.fullDescription.length, max: LIMITS.FULL_DESCRIPTION }}
        >
          <textarea
            value={formData.fullDescription}
            onChange={(e) => {
              const newDesc = e.target.value;
              setFormData({ ...formData, fullDescription: newDesc });
              validateField('fullDescription', newDesc);
            }}
            onBlur={() => validateField('fullDescription', formData.fullDescription)}
            required
            rows={8}
            placeholder="Write a comprehensive description of the package..."
            maxLength={LIMITS.FULL_DESCRIPTION}
            className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none transition-all ${
              errors.fullDescription ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
            }`}
          />
        </ValidationFieldWrapper>
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Itinerary</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add detailed itinerary days with activities, meals, and accommodation
        </p>
        <ItineraryDayEditor
          itinerary={formData.itinerary}
          onChange={(itinerary) => setFormData({ ...formData, itinerary })}
        />
      </div>

      {/* Included/Excluded */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">What's Included & Excluded</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-2">
              <ArrayLimitIndicator
                current={formData.included.length}
                max={ARRAY_LIMITS.INCLUDED_EXCLUDED}
                itemName="included items"
              />
            </div>
            <ArrayEditor
              items={formData.included}
              onChange={(included) => setFormData({ ...formData, included })}
              label="Included Items"
              addButtonLabel="Add Included Item"
              itemPlaceholder="e.g., All meals included"
            />
          </div>
          <div>
            <div className="mb-2">
              <ArrayLimitIndicator
                current={formData.excluded.length}
                max={ARRAY_LIMITS.INCLUDED_EXCLUDED}
                itemName="excluded items"
              />
            </div>
            <ArrayEditor
              items={formData.excluded}
              onChange={(excluded) => setFormData({ ...formData, excluded })}
              label="Excluded Items"
              addButtonLabel="Add Excluded Item"
              itemPlaceholder="e.g., International flights"
            />
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
        <p className="text-sm text-gray-600 mb-4">
          Add common questions and answers that will be displayed on the package detail page
        </p>
        <FAQEditor
          faq={formData.faq}
          onChange={(faq) => setFormData({ ...formData, faq })}
        />
      </div>

      {/* Available Dates */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-gray-800">Available Dates</h2>
          <ArrayLimitIndicator
            current={formData.availableDates.length}
            max={ARRAY_LIMITS.AVAILABLE_DATES}
            itemName="dates"
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Add available dates for this package (format: YYYY-MM-DD)
        </p>
        <ArrayEditor
          items={formData.availableDates}
          onChange={(availableDates) => setFormData({ ...formData, availableDates })}
          addButtonLabel="Add Date"
          itemPlaceholder="YYYY-MM-DD"
        />
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
          {saving ? 'Saving...' : packageId ? 'Update Package' : 'Create Package'}
        </motion.button>
      </div>
    </form>
  );
}

