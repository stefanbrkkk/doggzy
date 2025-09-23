import { z } from 'zod'
import {
  BlogStorySchema,
  DogProfileSchema,
  CreateBlogStorySchema,
  UpdateBlogStorySchema,
  CreateDogProfileSchema,
  UpdateDogProfileSchema,
  type BlogStory,
  type DogProfile,
  type CreateBlogStoryData,
  type UpdateBlogStoryData,
  type CreateDogProfileData,
  type UpdateDogProfileData,
} from '@/lib/types/content'

// Validation functions
export function validateBlogStory(data: unknown): { success: true; data: BlogStory } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = BlogStorySchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function validateCreateBlogStory(data: unknown): { success: true; data: CreateBlogStoryData } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = CreateBlogStorySchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function validateUpdateBlogStory(data: unknown): { success: true; data: UpdateBlogStoryData } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = UpdateBlogStorySchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function validateDogProfile(data: unknown): { success: true; data: DogProfile } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = DogProfileSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function validateCreateDogProfile(data: unknown): { success: true; data: CreateDogProfileData } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = CreateDogProfileSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export function validateUpdateDogProfile(data: unknown): { success: true; data: UpdateDogProfileData } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = UpdateDogProfileSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

// Format validation errors for API responses
export function formatValidationErrors(errors: z.ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {}
  
  for (const error of errors.issues) {
    const path = error.path.join('.')
    if (!formatted[path]) {
      formatted[path] = []
    }
    formatted[path].push(error.message)
  }
  
  return formatted
}

// Content-specific validation rules
export const ContentValidationRules = {
  slug: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-z0-9-]+$/,
    reservedSlugs: ['admin', 'api', 'auth', 'login', 'logout', 'new', 'edit', 'delete'],
  },
  title: {
    minLength: 5,
    maxLength: 200,
  },
  summary: {
    minLength: 10,
    maxLength: 500,
  },
  content: {
    minLength: 50,
    maxLength: 50000, // ~25 pages of text
  },
  tags: {
    maxCount: 10,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s-]+$/,
  },
  media: {
    maxGalleryItems: 20,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
}

// Custom validation functions
export function validateSlug(slug: string, existingSlugs: string[] = []): { valid: boolean; error?: string } {
  const rules = ContentValidationRules.slug
  
  if (slug.length < rules.minLength) {
    return { valid: false, error: `Slug must be at least ${rules.minLength} characters long` }
  }
  
  if (slug.length > rules.maxLength) {
    return { valid: false, error: `Slug must be no more than ${rules.maxLength} characters long` }
  }
  
  if (!rules.pattern.test(slug)) {
    return { valid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' }
  }
  
  if (rules.reservedSlugs.includes(slug)) {
    return { valid: false, error: 'This slug is reserved and cannot be used' }
  }
  
  if (existingSlugs.includes(slug)) {
    return { valid: false, error: 'This slug is already in use' }
  }
  
  return { valid: true }
}

export function validateTags(tags: string[]): { valid: boolean; error?: string } {
  const rules = ContentValidationRules.tags
  
  if (tags.length > rules.maxCount) {
    return { valid: false, error: `Maximum ${rules.maxCount} tags allowed` }
  }
  
  for (const tag of tags) {
    if (tag.length > rules.maxLength) {
      return { valid: false, error: `Tag "${tag}" is too long (max ${rules.maxLength} characters)` }
    }
    
    if (!rules.pattern.test(tag)) {
      return { valid: false, error: `Tag "${tag}" contains invalid characters` }
    }
  }
  
  return { valid: true }
}

export function validateContentLength(content: string, type: 'summary' | 'content'): { valid: boolean; error?: string } {
  const rules = type === 'summary' ? ContentValidationRules.summary : ContentValidationRules.content
  
  if (content.length < rules.minLength) {
    return { valid: false, error: `${type} must be at least ${rules.minLength} characters long` }
  }
  
  if (content.length > rules.maxLength) {
    return { valid: false, error: `${type} must be no more than ${rules.maxLength} characters long` }
  }
  
  return { valid: true }
}

// Schema validation helpers
export const ValidationSchemas = {
  BlogStory: BlogStorySchema,
  DogProfile: DogProfileSchema,
  CreateBlogStory: CreateBlogStorySchema,
  UpdateBlogStory: UpdateBlogStorySchema,
  CreateDogProfile: CreateDogProfileSchema,
  UpdateDogProfile: UpdateDogProfileSchema,
}

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: z.ZodError }

export type FieldValidationResult = 
  | { valid: true }
  | { valid: false; error: string }
