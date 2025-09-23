import { promises as fs } from 'fs'
import path from 'path'
import {
  type BlogStory,
  type DogProfile,
  type CreateBlogStoryData,
  type UpdateBlogStoryData,
  type CreateDogProfileData,
  type UpdateDogProfileData,
  type ContentFilters,
  type ContentSortOptions,
  type ContentListResponse,
  generateId,
  generateSlug,
  calculateReadingTime,
} from '@/lib/types/content'
import {
  validateBlogStory,
  validateDogProfile,
  validateSlug,
} from '@/lib/validation/content'

// Base storage adapter interface
interface StorageAdapter<T, CreateData, UpdateData> {
  getAll(filters?: ContentFilters, sort?: ContentSortOptions): Promise<ContentListResponse<T>>
  getBySlug(slug: string): Promise<T | null>
  getById(id: string): Promise<T | null>
  create(data: CreateData): Promise<T>
  update(id: string, data: UpdateData): Promise<T>
  delete(id: string): Promise<boolean>
  exists(slug: string): Promise<boolean>
  getAllSlugs(): Promise<string[]>
}

// File system utilities
class FileSystemUtils {
  static async ensureDir(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath)
    } catch {
      await fs.mkdir(dirPath, { recursive: true })
    }
  }

  static async readJsonFile<T>(filePath: string): Promise<T | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content)
    } catch {
      return null
    }
  }

  static async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    const content = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, content, 'utf-8')
  }

  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath)
      return true
    } catch {
      return false
    }
  }

  static async listFiles(dirPath: string, extension = '.json'): Promise<string[]> {
    try {
      const files = await fs.readdir(dirPath)
      return files.filter(file => file.endsWith(extension))
    } catch {
      return []
    }
  }
}

// Blog story adapter
export class BlogStoryAdapter implements StorageAdapter<BlogStory, CreateBlogStoryData, UpdateBlogStoryData> {
  private readonly contentDir = path.join(process.cwd(), 'src/content/stories')

  constructor() {
    // Ensure content directory exists
    FileSystemUtils.ensureDir(this.contentDir).catch(console.error)
  }

  private getFilePath(slug: string): string {
    return path.join(this.contentDir, `${slug}.json`)
  }

  async getAll(filters: ContentFilters = {}, sort: ContentSortOptions = { field: 'updatedAt', direction: 'desc' }): Promise<ContentListResponse<BlogStory>> {
    const files = await FileSystemUtils.listFiles(this.contentDir)
    const stories: BlogStory[] = []

    for (const file of files) {
      const slug = file.replace('.json', '')
      const story = await this.getBySlug(slug)
      if (story) {
        stories.push(story)
      }
    }

    // Apply filters
    const filteredStories = stories.filter(story => {
      if (filters.status && filters.status !== 'all' && story.status !== filters.status) {
        return false
      }
      if (filters.featured !== undefined && story.featured !== filters.featured) {
        return false
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => story.tags.includes(tag))
        if (!hasMatchingTag) return false
      }
      if (filters.category && story.category !== filters.category) {
        return false
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          story.title.toLowerCase().includes(searchLower) ||
          story.summary.toLowerCase().includes(searchLower) ||
          story.content.toLowerCase().includes(searchLower) ||
          story.tags.some(tag => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }
      return true
    })

    // Apply sorting
    filteredStories.sort((a, b) => {
      let aValue: unknown = (a as Record<string, unknown>)[sort.field]
      let bValue: unknown = (b as Record<string, unknown>)[sort.field]

      if (sort.field === 'title' || sort.field === 'name') {
        aValue = (aValue as string)?.toLowerCase() || ''
        bValue = (bValue as string)?.toLowerCase() || ''
      } else if (sort.field.endsWith('At')) {
        aValue = new Date((aValue as string) || 0).getTime()
        bValue = new Date((bValue as string) || 0).getTime()
      }

      if (sort.direction === 'desc') {
        return (bValue as number) > (aValue as number) ? 1 : (bValue as number) < (aValue as number) ? -1 : 0
      } else {
        return (aValue as number) > (bValue as number) ? 1 : (aValue as number) < (bValue as number) ? -1 : 0
      }
    })

    // Apply pagination
    const offset = filters.offset || 0
    const limit = filters.limit || 50
    const paginatedStories = filteredStories.slice(offset, offset + limit)

    return {
      items: paginatedStories,
      total: filteredStories.length,
      offset,
      limit,
      hasMore: offset + limit < filteredStories.length,
    }
  }

  async getBySlug(slug: string): Promise<BlogStory | null> {
    const filePath = this.getFilePath(slug)
    const data = await FileSystemUtils.readJsonFile<BlogStory>(filePath)
    
    if (!data) return null

    const validation = validateBlogStory(data)
    if (!validation.success) {
      console.error(`Invalid story data for slug ${slug}:`, validation.errors)
      return null
    }

    return validation.data
  }

  async getById(id: string): Promise<BlogStory | null> {
    const files = await FileSystemUtils.listFiles(this.contentDir)
    
    for (const file of files) {
      const slug = file.replace('.json', '')
      const story = await this.getBySlug(slug)
      if (story && story.id === id) {
        return story
      }
    }
    
    return null
  }

  async create(data: CreateBlogStoryData): Promise<BlogStory> {
    const now = new Date().toISOString()
    const id = generateId()
    
    // Generate slug if not provided or validate existing
    let slug = data.slug || generateSlug(data.title)
    const existingSlugs = await this.getAllSlugs()
    const slugValidation = validateSlug(slug, existingSlugs)
    
    if (!slugValidation.valid) {
      // Auto-generate a unique slug
      let counter = 1
      let newSlug = slug
      while (existingSlugs.includes(newSlug)) {
        newSlug = `${slug}-${counter}`
        counter++
      }
      slug = newSlug
    }

    const story: BlogStory = {
      ...data,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'published' ? now : undefined,
      readingTime: calculateReadingTime(data.content),
    }

    const validation = validateBlogStory(story)
    if (!validation.success) {
      throw new Error(`Invalid story data: ${validation.errors.message}`)
    }

    const filePath = this.getFilePath(slug)
    await FileSystemUtils.writeJsonFile(filePath, story)
    
    return story
  }

  async update(id: string, data: UpdateBlogStoryData): Promise<BlogStory> {
    const existingStory = await this.getById(id)
    if (!existingStory) {
      throw new Error('Story not found')
    }

    const now = new Date().toISOString()
    const updatedStory = {
      ...existingStory,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: now,
    }

    // Handle slug changes
    if (data.slug && data.slug !== existingStory.slug) {
      const existingSlugs = await this.getAllSlugs()
      const otherSlugs = existingSlugs.filter(s => s !== existingStory.slug)
      const slugValidation = validateSlug(data.slug, otherSlugs)
      
      if (!slugValidation.valid) {
        throw new Error(slugValidation.error)
      }

      // Delete old file and create new one
      await this.delete(id)
      updatedStory.slug = data.slug
    }

    // Handle status changes
    if (data.status === 'published' && existingStory.status !== 'published') {
      updatedStory.publishedAt = now
    } else if (data.status === 'draft') {
      updatedStory.publishedAt = undefined
    }

    // Recalculate reading time if content changed
    if (data.content && data.content !== existingStory.content) {
      updatedStory.readingTime = calculateReadingTime(data.content)
    }

    const validation = validateBlogStory(updatedStory)
    if (!validation.success) {
      throw new Error(`Invalid story data: ${validation.errors.message}`)
    }

    const filePath = this.getFilePath(updatedStory.slug)
    await FileSystemUtils.writeJsonFile(filePath, updatedStory)
    
    return updatedStory
  }

  async delete(id: string): Promise<boolean> {
    const story = await this.getById(id)
    if (!story) return false

    const filePath = this.getFilePath(story.slug)
    return await FileSystemUtils.deleteFile(filePath)
  }

  async exists(slug: string): Promise<boolean> {
    const story = await this.getBySlug(slug)
    return !!story
  }

  async getAllSlugs(): Promise<string[]> {
    const files = await FileSystemUtils.listFiles(this.contentDir)
    return files.map(file => file.replace('.json', ''))
  }
}

// Dog profile adapter
export class DogProfileAdapter implements StorageAdapter<DogProfile, CreateDogProfileData, UpdateDogProfileData> {
  private readonly contentDir = path.join(process.cwd(), 'src/content/dogs')

  constructor() {
    // Ensure content directory exists
    FileSystemUtils.ensureDir(this.contentDir).catch(console.error)
  }

  private getFilePath(slug: string): string {
    return path.join(this.contentDir, `${slug}.json`)
  }

  async getAll(filters: ContentFilters = {}, sort: ContentSortOptions = { field: 'updatedAt', direction: 'desc' }): Promise<ContentListResponse<DogProfile>> {
    const files = await FileSystemUtils.listFiles(this.contentDir)
    const dogs: DogProfile[] = []

    for (const file of files) {
      const slug = file.replace('.json', '')
      const dog = await this.getBySlug(slug)
      if (dog) {
        dogs.push(dog)
      }
    }

    // Apply filters
    const filteredDogs = dogs.filter(dog => {
      if (filters.status && filters.status !== 'all' && dog.status !== filters.status) {
        return false
      }
      if (filters.featured !== undefined && dog.featured !== filters.featured) {
        return false
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => dog.tags.includes(tag))
        if (!hasMatchingTag) return false
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          dog.name.toLowerCase().includes(searchLower) ||
          dog.description.toLowerCase().includes(searchLower) ||
          (dog.breed && dog.breed.toLowerCase().includes(searchLower)) ||
          dog.location.city.toLowerCase().includes(searchLower) ||
          dog.tags.some(tag => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }
      return true
    })

    // Apply sorting
    filteredDogs.sort((a, b) => {
      let aValue: unknown = (a as Record<string, unknown>)[sort.field === 'title' ? 'name' : sort.field]
      let bValue: unknown = (b as Record<string, unknown>)[sort.field === 'title' ? 'name' : sort.field]

      if (sort.field === 'title' || sort.field === 'name') {
        aValue = (aValue as string)?.toLowerCase() || ''
        bValue = (bValue as string)?.toLowerCase() || ''
      } else if (sort.field.endsWith('At')) {
        aValue = new Date((aValue as string) || 0).getTime()
        bValue = new Date((bValue as string) || 0).getTime()
      }

      if (sort.direction === 'desc') {
        return (bValue as number) > (aValue as number) ? 1 : (bValue as number) < (aValue as number) ? -1 : 0
      } else {
        return (aValue as number) > (bValue as number) ? 1 : (aValue as number) < (bValue as number) ? -1 : 0
      }
    })

    // Apply pagination
    const offset = filters.offset || 0
    const limit = filters.limit || 50
    const paginatedDogs = filteredDogs.slice(offset, offset + limit)

    return {
      items: paginatedDogs,
      total: filteredDogs.length,
      offset,
      limit,
      hasMore: offset + limit < filteredDogs.length,
    }
  }

  async getBySlug(slug: string): Promise<DogProfile | null> {
    const filePath = this.getFilePath(slug)
    const data = await FileSystemUtils.readJsonFile<DogProfile>(filePath)
    
    if (!data) return null

    const validation = validateDogProfile(data)
    if (!validation.success) {
      console.error(`Invalid dog profile data for slug ${slug}:`, validation.errors)
      return null
    }

    return validation.data
  }

  async getById(id: string): Promise<DogProfile | null> {
    const files = await FileSystemUtils.listFiles(this.contentDir)
    
    for (const file of files) {
      const slug = file.replace('.json', '')
      const dog = await this.getBySlug(slug)
      if (dog && dog.id === id) {
        return dog
      }
    }
    
    return null
  }

  async create(data: CreateDogProfileData): Promise<DogProfile> {
    const now = new Date().toISOString()
    const id = generateId()
    
    // Generate slug if not provided or validate existing
    let slug = data.slug || generateSlug(data.name)
    const existingSlugs = await this.getAllSlugs()
    const slugValidation = validateSlug(slug, existingSlugs)
    
    if (!slugValidation.valid) {
      // Auto-generate a unique slug
      let counter = 1
      let newSlug = slug
      while (existingSlugs.includes(newSlug)) {
        newSlug = `${slug}-${counter}`
        counter++
      }
      slug = newSlug
    }

    const dog: DogProfile = {
      ...data,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.status === 'published' ? now : undefined,
    }

    const validation = validateDogProfile(dog)
    if (!validation.success) {
      throw new Error(`Invalid dog profile data: ${validation.errors.message}`)
    }

    const filePath = this.getFilePath(slug)
    await FileSystemUtils.writeJsonFile(filePath, dog)
    
    return dog
  }

  async update(id: string, data: UpdateDogProfileData): Promise<DogProfile> {
    const existingDog = await this.getById(id)
    if (!existingDog) {
      throw new Error('Dog profile not found')
    }

    const now = new Date().toISOString()
    const updatedDog = {
      ...existingDog,
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: now,
    }

    // Handle slug changes
    if (data.slug && data.slug !== existingDog.slug) {
      const existingSlugs = await this.getAllSlugs()
      const otherSlugs = existingSlugs.filter(s => s !== existingDog.slug)
      const slugValidation = validateSlug(data.slug, otherSlugs)
      
      if (!slugValidation.valid) {
        throw new Error(slugValidation.error)
      }

      // Delete old file and create new one
      await this.delete(id)
      updatedDog.slug = data.slug
    }

    // Handle status changes
    if (data.status === 'published' && existingDog.status !== 'published') {
      updatedDog.publishedAt = now
    } else if (data.status === 'draft') {
      updatedDog.publishedAt = undefined
    }

    const validation = validateDogProfile(updatedDog)
    if (!validation.success) {
      throw new Error(`Invalid dog profile data: ${validation.errors.message}`)
    }

    const filePath = this.getFilePath(updatedDog.slug)
    await FileSystemUtils.writeJsonFile(filePath, updatedDog)
    
    return updatedDog
  }

  async delete(id: string): Promise<boolean> {
    const dog = await this.getById(id)
    if (!dog) return false

    const filePath = this.getFilePath(dog.slug)
    return await FileSystemUtils.deleteFile(filePath)
  }

  async exists(slug: string): Promise<boolean> {
    const dog = await this.getBySlug(slug)
    return !!dog
  }

  async getAllSlugs(): Promise<string[]> {
    const files = await FileSystemUtils.listFiles(this.contentDir)
    return files.map(file => file.replace('.json', ''))
  }
}

// Singleton instances
export const blogStoryAdapter = new BlogStoryAdapter()
export const dogProfileAdapter = new DogProfileAdapter()

// Export adapters map for dynamic access
export const contentAdapters = {
  story: blogStoryAdapter,
  dog: dogProfileAdapter,
} as const
