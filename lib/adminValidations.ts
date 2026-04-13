import { z } from 'zod';

// Character limit constants
const LIMITS = {
  TITLE: 100,
  SHORT_DESCRIPTION: 250,
  FULL_DESCRIPTION: 5000,
  SLUG: 100,
  ARRAY_ITEM: 200,
  REVIEW_TEXT: 2000,
  FAQ_QUESTION: 200,
  FAQ_ANSWER: 1000,
  ITINERARY_DAY_TITLE: 100,
  ITINERARY_DAY_DESCRIPTION: 1000,
  ACTIVITY_MEAL: 150,
  SEO_TITLE: 60,
  SEO_DESCRIPTION: 160,
  REVIEWER_NAME: 100,
  LOCATION: 100,
  DURATION: 50,
} as const;

// Array limit constants
const ARRAY_LIMITS = {
  ITINERARY_DAYS: 30,
  HIGHLIGHTS: 10,
  INCLUDED_EXCLUDED: 20,
  FAQ_ITEMS: 15,
  ACTIVITIES_PER_DAY: 10,
  MEALS_PER_DAY: 5,
  IMAGES: 20,
  AVAILABLE_DATES: 50,
} as const;

// Helper schemas
const urlSchema = z.string().url('Must be a valid URL').or(z.literal(''));
const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(LIMITS.SLUG, `Slug must be ${LIMITS.SLUG} characters or less`)
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Slug cannot start or end with a hyphen');

// Itinerary Day Schema
const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z
    .string()
    .min(1, 'Day title is required')
    .max(LIMITS.ITINERARY_DAY_TITLE, `Title must be ${LIMITS.ITINERARY_DAY_TITLE} characters or less`),
  description: z
    .string()
    .min(1, 'Day description is required')
    .max(LIMITS.ITINERARY_DAY_DESCRIPTION, `Description must be ${LIMITS.ITINERARY_DAY_DESCRIPTION} characters or less`),
  activities: z
    .array(z.string().max(LIMITS.ACTIVITY_MEAL, `Each activity must be ${LIMITS.ACTIVITY_MEAL} characters or less`))
    .max(ARRAY_LIMITS.ACTIVITIES_PER_DAY, `Maximum ${ARRAY_LIMITS.ACTIVITIES_PER_DAY} activities per day`)
    .min(1, 'At least one activity is required'),
  meals: z
    .array(z.string().max(LIMITS.ACTIVITY_MEAL, `Each meal must be ${LIMITS.ACTIVITY_MEAL} characters or less`))
    .max(ARRAY_LIMITS.MEALS_PER_DAY, `Maximum ${ARRAY_LIMITS.MEALS_PER_DAY} meals per day`),
  accommodation: z.string().optional(),
});

// FAQ Schema
const faqSchema = z.object({
  question: z
    .string()
    .min(1, 'Question is required')
    .max(LIMITS.FAQ_QUESTION, `Question must be ${LIMITS.FAQ_QUESTION} characters or less`),
  answer: z
    .string()
    .min(1, 'Answer is required')
    .max(LIMITS.FAQ_ANSWER, `Answer must be ${LIMITS.FAQ_ANSWER} characters or less`),
});

// Package Schema
export const packageSchema = z.object({
  name: z
    .string()
    .min(1, 'Package name is required')
    .max(LIMITS.TITLE, `Name must be ${LIMITS.TITLE} characters or less`),
  slug: slugSchema,
  shortDescription: z
    .string()
    .min(1, 'Short description is required')
    .max(LIMITS.SHORT_DESCRIPTION, `Short description must be ${LIMITS.SHORT_DESCRIPTION} characters or less`),
  fullDescription: z
    .string()
    .min(1, 'Full description is required')
    .max(LIMITS.FULL_DESCRIPTION, `Full description must be ${LIMITS.FULL_DESCRIPTION} characters or less`),
  price: z.number().positive('Price must be positive').max(999999, 'Price cannot exceed 999,999'),
  currency: z.string().default('USD'),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .max(LIMITS.DURATION, `Duration must be ${LIMITS.DURATION} characters or less`),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(LIMITS.LOCATION, `Location must be ${LIMITS.LOCATION} characters or less`),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
  groupSize: z.number().int().min(1, 'Group size must be at least 1').max(50, 'Group size cannot exceed 50'),
  featuredImage: urlSchema.refine((val) => val !== '', 'Featured image URL is required'),
  images: z
    .array(urlSchema)
    .max(ARRAY_LIMITS.IMAGES, `Maximum ${ARRAY_LIMITS.IMAGES} images allowed`)
    .default([]),
  category: z.enum(['Adventure', 'Culture', 'Relaxation', 'Wellness']),
  featured: z.boolean().default(false),
  availableDates: z
    .array(z.string())
    .max(ARRAY_LIMITS.AVAILABLE_DATES, `Maximum ${ARRAY_LIMITS.AVAILABLE_DATES} dates allowed`)
    .default([]),
  itinerary: z
    .array(itineraryDaySchema)
    .max(ARRAY_LIMITS.ITINERARY_DAYS, `Maximum ${ARRAY_LIMITS.ITINERARY_DAYS} itinerary days allowed`)
    .min(1, 'At least one itinerary day is required'),
  included: z
    .array(z.string().max(LIMITS.ARRAY_ITEM, `Each item must be ${LIMITS.ARRAY_ITEM} characters or less`))
    .max(ARRAY_LIMITS.INCLUDED_EXCLUDED, `Maximum ${ARRAY_LIMITS.INCLUDED_EXCLUDED} included items allowed`)
    .default([]),
  excluded: z
    .array(z.string().max(LIMITS.ARRAY_ITEM, `Each item must be ${LIMITS.ARRAY_ITEM} characters or less`))
    .max(ARRAY_LIMITS.INCLUDED_EXCLUDED, `Maximum ${ARRAY_LIMITS.INCLUDED_EXCLUDED} excluded items allowed`)
    .default([]),
  faq: z
    .array(faqSchema)
    .max(ARRAY_LIMITS.FAQ_ITEMS, `Maximum ${ARRAY_LIMITS.FAQ_ITEMS} FAQ items allowed`)
    .default([]),
  highlights: z
    .array(z.string().max(LIMITS.ARRAY_ITEM, `Each highlight must be ${LIMITS.ARRAY_ITEM} characters or less`))
    .max(ARRAY_LIMITS.HIGHLIGHTS, `Maximum ${ARRAY_LIMITS.HIGHLIGHTS} highlights allowed`)
    .default([]),
});

// Blog Post Schema
export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(LIMITS.TITLE, `Title must be ${LIMITS.TITLE} characters or less`),
  slug: slugSchema,
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .max(LIMITS.SHORT_DESCRIPTION, `Excerpt must be ${LIMITS.SHORT_DESCRIPTION} characters or less`),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(LIMITS.FULL_DESCRIPTION, `Content must be ${LIMITS.FULL_DESCRIPTION} characters or less`),
  featuredImage: urlSchema.refine((val) => val !== '', 'Featured image URL is required'),
  images: z
    .array(urlSchema)
    .max(ARRAY_LIMITS.IMAGES, `Maximum ${ARRAY_LIMITS.IMAGES} images allowed`)
    .default([]),
  authorId: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tagIds: z.array(z.string()).default([]),
  publishedAt: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  seoTitle: z
    .string()
    .max(LIMITS.SEO_TITLE, `SEO title must be ${LIMITS.SEO_TITLE} characters or less`)
    .optional()
    .or(z.literal('')),
  seoDescription: z
    .string()
    .max(LIMITS.SEO_DESCRIPTION, `SEO description must be ${LIMITS.SEO_DESCRIPTION} characters or less`)
    .optional()
    .or(z.literal('')),
});

// Review Schema
export const reviewSchema = z.object({
  platform: z.enum(['Google', 'TripAdvisor']),
  reviewerName: z
    .string()
    .min(2, 'Reviewer name must be at least 2 characters')
    .max(LIMITS.REVIEWER_NAME, `Reviewer name must be ${LIMITS.REVIEWER_NAME} characters or less`),
  reviewerAvatar: urlSchema.optional(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  reviewText: z
    .string()
    .min(10, 'Review text must be at least 10 characters')
    .max(LIMITS.REVIEW_TEXT, `Review text must be ${LIMITS.REVIEW_TEXT} characters or less`),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid date format' }
  ),
  reviewUrl: urlSchema.optional(),
  verified: z.boolean().default(false),
});

// Export types
export type PackageFormData = z.infer<typeof packageSchema>;
export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;

// Export validation functions
export function validatePackage(data: unknown) {
  return packageSchema.safeParse(data);
}

export function validateBlogPost(data: unknown) {
  return blogPostSchema.safeParse(data);
}

export function validateReview(data: unknown) {
  return reviewSchema.safeParse(data);
}

// Export constants for use in components
export { LIMITS, ARRAY_LIMITS };

