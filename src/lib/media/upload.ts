import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'
import type { MediaItem } from '@/lib/types/content'

// Media validation schemas
export const MediaUploadSchema = z.object({
  file: z.any(), // File object from FormData
  type: z.enum(['stories', 'dogs']),
  slug: z.string().min(1, 'Slug is required'),
  alt: z.string().min(1, 'Alt text is required').max(200, 'Alt text too long'),
  caption: z.string().max(500, 'Caption too long').optional(),
})

export const MediaConfigSchema = z.object({
  maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedMimeTypes: z.array(z.string()).default([
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]),
  allowedExtensions: z.array(z.string()).default([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.svg'
  ]),
  maxWidth: z.number().default(2048),
  maxHeight: z.number().default(2048),
})

export type MediaUploadData = z.infer<typeof MediaUploadSchema>
export type MediaConfig = z.infer<typeof MediaConfigSchema>

// Default media configuration
export const defaultMediaConfig: MediaConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ],
  allowedExtensions: [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.gif',
    '.svg'
  ],
  maxWidth: 2048,
  maxHeight: 2048,
}

// Media validation functions
export function validateFileType(file: File, config: MediaConfig = defaultMediaConfig): { valid: boolean; error?: string } {
  // Check MIME type
  if (!config.allowedMimeTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedMimeTypes.join(', ')}` 
    }
  }

  // Check file extension
  const extension = path.extname(file.name).toLowerCase()
  if (!config.allowedExtensions.includes(extension)) {
    return { 
      valid: false, 
      error: `File extension ${extension} is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}` 
    }
  }

  return { valid: true }
}

export function validateFileSize(file: File, config: MediaConfig = defaultMediaConfig): { valid: boolean; error?: string } {
  if (file.size > config.maxFileSize) {
    const maxSizeMB = Math.round(config.maxFileSize / (1024 * 1024))
    const fileSizeMB = Math.round(file.size / (1024 * 1024) * 100) / 100
    return { 
      valid: false, 
      error: `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB` 
    }
  }

  return { valid: true }
}

// Generate safe filename
export function generateSafeFilename(originalName: string, slug: string): string {
  const extension = path.extname(originalName).toLowerCase()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 6)
  
  // Sanitize slug for filename
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substr(0, 30) // Limit length

  return `${safeSlug}-${timestamp}-${random}${extension}`
}

// Get upload directory path
export function getUploadDir(type: 'stories' | 'dogs', slug: string): string {
  return path.join(process.cwd(), 'public', 'uploads', type, slug)
}

// Get public URL for uploaded file
export function getPublicUrl(type: 'stories' | 'dogs', slug: string, filename: string): string {
  return `/uploads/${type}/${slug}/${filename}`
}

// Ensure upload directory exists
export async function ensureUploadDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

// Save uploaded file
export async function saveUploadedFile(
  file: File,
  type: 'stories' | 'dogs',
  slug: string,
  config: MediaConfig = defaultMediaConfig
): Promise<{ filename: string; path: string; url: string; size: number }> {
  // Validate file
  const typeValidation = validateFileType(file, config)
  if (!typeValidation.valid) {
    throw new Error(typeValidation.error)
  }

  const sizeValidation = validateFileSize(file, config)
  if (!sizeValidation.valid) {
    throw new Error(sizeValidation.error)
  }

  // Generate safe filename and paths
  const filename = generateSafeFilename(file.name, slug)
  const uploadDir = getUploadDir(type, slug)
  const filePath = path.join(uploadDir, filename)
  const publicUrl = getPublicUrl(type, slug, filename)

  // Ensure directory exists
  await ensureUploadDir(uploadDir)

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  return {
    filename,
    path: filePath,
    url: publicUrl,
    size: file.size,
  }
}

// Delete uploaded file
export async function deleteUploadedFile(
  type: 'stories' | 'dogs',
  slug: string,
  filename: string
): Promise<boolean> {
  try {
    const uploadDir = getUploadDir(type, slug)
    const filePath = path.join(uploadDir, filename)
    await fs.unlink(filePath)
    
    // Try to remove directory if empty
    try {
      const files = await fs.readdir(uploadDir)
      if (files.length === 0) {
        await fs.rmdir(uploadDir)
      }
    } catch {
      // Directory not empty or doesn't exist, ignore
    }
    
    return true
  } catch (error) {
    console.error('Failed to delete file:', error)
    return false
  }
}

// List files in upload directory
export async function listUploadedFiles(
  type: 'stories' | 'dogs',
  slug: string
): Promise<Array<{ filename: string; url: string; size: number; modified: Date }>> {
  try {
    const uploadDir = getUploadDir(type, slug)
    const files = await fs.readdir(uploadDir)
    const fileDetails = []

    for (const filename of files) {
      const filePath = path.join(uploadDir, filename)
      const stats = await fs.stat(filePath)
      
      fileDetails.push({
        filename,
        url: getPublicUrl(type, slug, filename),
        size: stats.size,
        modified: stats.mtime,
      })
    }

    return fileDetails.sort((a, b) => b.modified.getTime() - a.modified.getTime())
  } catch {
    return []
  }
}

// Create MediaItem from uploaded file
export function createMediaItem(
  uploadResult: { filename: string; url: string; size: number },
  alt: string,
  caption?: string
): MediaItem {
  const extension = path.extname(uploadResult.filename).toLowerCase().substr(1)
  
  return {
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    src: uploadResult.url,
    alt,
    caption,
    size: uploadResult.size,
    format: extension,
  }
}

// Get image dimensions (requires additional image processing library in production)
export async function getImageDimensions(_filePath: string): Promise<{ width: number; height: number } | null> {
  // Placeholder - in production you'd use a library like 'sharp' or 'image-size'
  // For now, return null and let the frontend handle dimensions
  return null
}

// Clean up old temporary files
export async function cleanupTempFiles(maxAge: number = 24 * 60 * 60 * 1000): Promise<void> {
  try {
    const tempDir = path.join(process.cwd(), 'public', 'uploads', 'temp')
    const files = await fs.readdir(tempDir)
    const now = Date.now()

    for (const filename of files) {
      const filePath = path.join(tempDir, filename)
      const stats = await fs.stat(filePath)
      
      if (now - stats.mtime.getTime() > maxAge) {
        await fs.unlink(filePath)
      }
    }
  } catch {
    // Temp directory doesn't exist or other error, ignore
  }
}

// Media utilities
export const MediaUtils = {
  validateFileType,
  validateFileSize,
  generateSafeFilename,
  getUploadDir,
  getPublicUrl,
  ensureUploadDir,
  saveUploadedFile,
  deleteUploadedFile,
  listUploadedFiles,
  createMediaItem,
  getImageDimensions,
  cleanupTempFiles,
}

// Export media configuration
export { defaultMediaConfig as MediaConfig }