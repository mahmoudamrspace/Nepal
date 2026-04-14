'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import { ValidationFieldWrapper, CharacterCounter, ArrayLimitIndicator } from './ValidationHelper';
import { LIMITS, ARRAY_LIMITS, validateBlogPost } from '@/lib/adminValidations';

interface BlogEditorProps {
  postId?: string;
}

export default function BlogEditor({ postId }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authors, setAuthors] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    images: [] as string[],
    authorId: '',
    category: '',
    tagIds: [] as string[],
    publishedAt: '',
    featured: false,
    seoTitle: '',
    seoDescription: '',
  });

  useEffect(() => {
    // Load authors and tags
    Promise.all([
      fetch('/api/admin/authors').then(res => res.json()),
      fetch('/api/admin/tags').then(res => res.json()),
    ]).then(([authorsData, tagsData]) => {
      setAuthors(authorsData);
      setTags(tagsData);
    });

    if (postId) {
      fetch(`/api/admin/blog/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            featuredImage: data.featuredImage || '',
            images: data.images || [],
            authorId: data.authorId || '',
            category: data.category || '',
            tagIds: data.tags?.map((t: any) => t.id) || [],
            publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().split('T')[0] : '',
            featured: data.featured || false,
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load post');
          setLoading(false);
        });
    }
  }, [postId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    delete newErrors[field];

    if (field === 'title' && value.length > LIMITS.TITLE) {
      newErrors[field] = `Title must be ${LIMITS.TITLE} characters or less`;
    } else if (field === 'slug' && value.length > LIMITS.SLUG) {
      newErrors[field] = `Slug must be ${LIMITS.SLUG} characters or less`;
    } else if (field === 'slug' && !/^[a-z0-9-]+$/.test(value)) {
      newErrors[field] = 'Slug must contain only lowercase letters, numbers, and hyphens';
    } else if (field === 'excerpt' && value.length > LIMITS.SHORT_DESCRIPTION) {
      newErrors[field] = `Excerpt must be ${LIMITS.SHORT_DESCRIPTION} characters or less`;
    } else if (field === 'content' && value.length > LIMITS.FULL_DESCRIPTION) {
      newErrors[field] = `Content must be ${LIMITS.FULL_DESCRIPTION} characters or less`;
    } else if (field === 'seoTitle' && value.length > LIMITS.SEO_TITLE) {
      newErrors[field] = `SEO title must be ${LIMITS.SEO_TITLE} characters or less`;
    } else if (field === 'seoDescription' && value.length > LIMITS.SEO_DESCRIPTION) {
      newErrors[field] = `SEO description must be ${LIMITS.SEO_DESCRIPTION} characters or less`;
    } else if (field === 'featuredImage' && value && !/^https?:\/\/.+/.test(value)) {
      newErrors[field] = 'Must be a valid URL';
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const validationResult = validateBlogPost({
      ...formData,
      seoTitle: formData.seoTitle || undefined,
      seoDescription: formData.seoDescription || undefined,
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
      const url = postId ? `/api/admin/blog/${postId}` : '/api/admin/blog';
      const method = postId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          publishedAt: formData.publishedAt || null,
        }),
      });

      if (response.ok) {
        toast.success(postId ? 'Post updated!' : 'Post created!');
        router.push('/admin/blog');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to save post');
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
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">Basic Information</h2>
        <div className="space-y-6">
          <div>
            <ValidationFieldWrapper
              label="Title"
              required
              error={errors.title}
              characterCount={{ current: formData.title.length, max: LIMITS.TITLE }}
            >
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData({ ...formData, title: newTitle, slug: generateSlug(newTitle) });
                  validateField('title', newTitle);
                }}
                onBlur={() => validateField('title', formData.title)}
                required
                maxLength={LIMITS.TITLE}
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                  errors.title ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
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
                maxLength={LIMITS.SLUG}
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                  errors.slug ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <ValidationFieldWrapper
              label="Excerpt"
              required
              error={errors.excerpt}
              characterCount={{ current: formData.excerpt.length, max: LIMITS.SHORT_DESCRIPTION }}
            >
              <textarea
                value={formData.excerpt}
                onChange={(e) => {
                  const newExcerpt = e.target.value;
                  setFormData({ ...formData, excerpt: newExcerpt });
                  validateField('excerpt', newExcerpt);
                }}
                onBlur={() => validateField('excerpt', formData.excerpt)}
                required
                rows={3}
                maxLength={LIMITS.SHORT_DESCRIPTION}
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, tagIds: [...formData.tagIds, tag.id] });
                      } else {
                        setFormData({ ...formData, tagIds: formData.tagIds.filter(id => id !== tag.id) });
                      }
                    }}
                    className="w-4 h-4 text-[#485342] border-gray-300 rounded focus:ring-[#485342]"
                  />
                  <span className="text-sm text-gray-700">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="mb-6">
          <h2 className="text-xl font-serif font-bold text-gray-800 mb-2">Content</h2>
          <CharacterCounter current={formData.content.length} max={LIMITS.FULL_DESCRIPTION} />
          {errors.content && (
            <div className="text-sm text-red-600 mt-1">{errors.content}</div>
          )}
        </div>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => {
            if (content.length <= LIMITS.FULL_DESCRIPTION) {
              setFormData({ ...formData, content });
              validateField('content', content);
            }
          }}
          placeholder="Write your blog post content here..."
        />
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
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                  errors.featuredImage ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <ImageUploader
                storageModule="blog"
                onImageSelect={(url) => {
                  setFormData((prev) => ({ ...prev, featuredImage: url }));
                  validateField('featuredImage', url);
                }}
                existingImages={formData.featuredImage ? [formData.featuredImage] : []}
              />
            </div>
          </div>
          <div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Images (one URL per line)
              </label>
              <ArrayLimitIndicator
                current={formData.images.length}
                max={ARRAY_LIMITS.IMAGES}
                itemName="images"
              />
            </div>
            <textarea
              value={formData.images.join('\n')}
              onChange={(e) => {
                const imageUrls = e.target.value.split('\n').filter(Boolean);
                if (imageUrls.length <= ARRAY_LIMITS.IMAGES) {
                  setFormData({ ...formData, images: imageUrls });
                }
              }}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none"
            />
          </div>
        </div>
      </div>

      {/* SEO & Publishing */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-6">SEO & Publishing</h2>
        <div className="space-y-6">
          <div>
            <ValidationFieldWrapper
              label="SEO Title"
              error={errors.seoTitle}
              characterCount={{ current: formData.seoTitle.length, max: LIMITS.SEO_TITLE }}
            >
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => {
                  const newSeoTitle = e.target.value;
                  setFormData({ ...formData, seoTitle: newSeoTitle });
                  validateField('seoTitle', newSeoTitle);
                }}
                onBlur={() => validateField('seoTitle', formData.seoTitle)}
                maxLength={LIMITS.SEO_TITLE}
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] ${
                  errors.seoTitle ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div>
            <ValidationFieldWrapper
              label="SEO Description"
              error={errors.seoDescription}
              characterCount={{ current: formData.seoDescription.length, max: LIMITS.SEO_DESCRIPTION }}
            >
              <textarea
                value={formData.seoDescription}
                onChange={(e) => {
                  const newSeoDesc = e.target.value;
                  setFormData({ ...formData, seoDescription: newSeoDesc });
                  validateField('seoDescription', newSeoDesc);
                }}
                onBlur={() => validateField('seoDescription', formData.seoDescription)}
                rows={3}
                maxLength={LIMITS.SEO_DESCRIPTION}
                className={`w-full px-4 py-3 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342] resize-none ${
                  errors.seoDescription ? 'border-red-500' : 'border-gray-300 focus:border-[#485342]'
                }`}
              />
            </ValidationFieldWrapper>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Publish Date</label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485342]"
              />
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
                Featured Post
              </label>
            </div>
          </div>
        </div>
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
          {saving ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </motion.button>
      </div>
    </form>
  );
}

