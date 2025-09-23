import { z } from 'zod'

// Base content schema
export const BaseContentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  status: z.enum(['draft', 'published']).default('draft'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  publishedAt: z.string().datetime().optional(),
})

// SEO metadata schema
export const SeoMetadataSchema = z.object({
  seoTitle: z.string().max(60, 'SEO title should be under 60 characters').optional(),
  seoDescription: z.string().max(160, 'SEO description should be under 160 characters').optional(),
  ogImage: z.string().optional(),
  ogType: z.string().default('article'),
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
  nofollow: z.boolean().default(false),
})

// Media item schema
export const MediaItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number().optional(), // file size in bytes
  format: z.string().optional(), // file extension
})

// Blog story schema
export const BlogStorySchema = BaseContentSchema.extend({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  summary: z.string().min(1, 'Summary is required').max(500, 'Summary is too long'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  heroImage: MediaItemSchema.optional(),
  gallery: z.array(MediaItemSchema).default([]),
  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    email: z.string().email().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
  }).optional(),
  category: z.string().optional(),
  readingTime: z.number().optional(), // estimated reading time in minutes
  featured: z.boolean().default(false),
  seo: SeoMetadataSchema.optional(),
})

// Dog profile schema
export const DogProfileSchema = BaseContentSchema.extend({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description is too long'),
  breed: z.string().max(100, 'Breed is too long').optional(),
  age: z.object({
    years: z.number().min(0).max(20),
    months: z.number().min(0).max(11).optional(),
  }).optional(),
  size: z.enum(['small', 'medium', 'large', 'giant']).optional(),
  gender: z.enum(['male', 'female']).optional(),
  weight: z.number().min(1).max(200).optional(), // in kg
  color: z.string().max(100, 'Color is too long').optional(),
  location: z.object({
    city: z.string().max(100, 'City is too long'),
    country: z.string().max(100, 'Country is too long'),
    shelter: z.string().max(200, 'Shelter name is too long').optional(),
  }),
  characteristics: z.object({
    energyLevel: z.enum(['low', 'moderate', 'high']).optional(),
    goodWithKids: z.boolean().optional(),
    goodWithDogs: z.boolean().optional(),
    goodWithCats: z.boolean().optional(),
    housetrained: z.boolean().optional(),
    specialNeeds: z.boolean().default(false),
    vaccinated: z.boolean().optional(),
    spayedNeutered: z.boolean().optional(),
  }).optional(),
  story: z.string().max(3000, 'Story is too long').optional(),
  tags: z.array(z.string()).default([]),
  heroImage: MediaItemSchema.optional(),
  gallery: z.array(MediaItemSchema).default([]),
  adoptionStatus: z.enum(['available', 'pending', 'adopted', 'foster', 'medical']).default('available'),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  sponsorshipGoal: z.number().min(0).optional(), // monthly sponsorship goal in dollars
  sponsorshipCurrent: z.number().min(0).default(0), // current monthly sponsorship amount
  featured: z.boolean().default(false),
  seo: SeoMetadataSchema.optional(),
})

// Content creation/update schemas (without auto-generated fields)
export const CreateBlogStorySchema = BlogStorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
})

export const UpdateBlogStorySchema = CreateBlogStorySchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
})

export const CreateDogProfileSchema = DogProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
})

export const UpdateDogProfileSchema = CreateDogProfileSchema.partial().extend({
  id: z.string().min(1, 'ID is required'),
})

// Type exports
export type BaseContent = z.infer<typeof BaseContentSchema>
export type SeoMetadata = z.infer<typeof SeoMetadataSchema>
export type MediaItem = z.infer<typeof MediaItemSchema>
export type BlogStory = z.infer<typeof BlogStorySchema>
export type DogProfile = z.infer<typeof DogProfileSchema>

export type CreateBlogStoryData = z.infer<typeof CreateBlogStorySchema>
export type UpdateBlogStoryData = z.infer<typeof UpdateBlogStorySchema>
export type CreateDogProfileData = z.infer<typeof CreateDogProfileSchema>
export type UpdateDogProfileData = z.infer<typeof UpdateDogProfileSchema>

// Content type union
export type ContentItem = BlogStory | DogProfile
export type ContentType = 'story' | 'dog'

// Filter and sort options
export interface ContentFilters {
  status?: 'draft' | 'published' | 'all'
  tags?: string[]
  category?: string
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface ContentSortOptions {
  field: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'name'
  direction: 'asc' | 'desc'
}

// Content list response
export interface ContentListResponse<T> {
  items: T[]
  total: number
  offset: number
  limit: number
  hasMore: boolean
}

// Utility functions for content
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function validateSlugUniqueness(slug: string, existingSlugs: string[]): boolean {
  return !existingSlugs.includes(slug)
}

export function sanitizeContent(content: string): string {
  // Basic content sanitization - in production you might want a more robust solution
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}