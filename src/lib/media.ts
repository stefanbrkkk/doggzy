// Media asset management utilities

export interface MediaAsset {
  id: string
  type: 'image' | 'video'
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  size?: number
  format?: string
  placeholder?: string
}

export interface VideoAsset extends MediaAsset {
  type: 'video'
  duration?: string
  thumbnail?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
}

export interface ImageAsset extends MediaAsset {
  type: 'image'
  srcSet?: string
  sizes?: string
}

// Media registry for organized asset management
export const mediaRegistry = {
  // Hero videos
  videos: {
    'hero-default': {
      id: 'hero-default',
      type: 'video' as const,
      src: '/videos/default.mp4',
      alt: 'Doggzy hero video showing rescued dogs',
      duration: '3:00',
      thumbnail: '/images/thumbnails/hero-default.jpg',
      autoplay: true,
      muted: true,
      loop: true
    },
    'adoption-hero': {
      id: 'adoption-hero',
      type: 'video' as const,
      src: '/videos/adoption-hero.mp4',
      alt: 'Happy families with their adopted dogs',
      duration: '2:30',
      thumbnail: '/images/thumbnails/adoption-hero.jpg',
      autoplay: true,
      muted: true,
      loop: true
    },
    'foster-hero': {
      id: 'foster-hero',
      type: 'video' as const,
      src: '/videos/foster-hero.mp4',
      alt: 'Foster families caring for rescue dogs',
      duration: '1:45',
      thumbnail: '/images/thumbnails/foster-hero.jpg',
      autoplay: true,
      muted: true,
      loop: true
    },
    'careers-hero': {
      id: 'careers-hero',
      type: 'video' as const,
      src: '/videos/careers-hero.mp4',
      alt: 'Doggzy team members working to save dogs',
      duration: '1:20',
      thumbnail: '/images/thumbnails/careers-hero.jpg',
      autoplay: true,
      muted: true,
      loop: true
    }
  },

  // Dog images
  dogs: {
    'bella': {
      id: 'bella',
      type: 'image' as const,
      src: '/images/dogs/bella.svg',
      alt: 'Bella - A happy rescued dog in her new home',
      width: 400,
      height: 400
    },
    'luna': {
      id: 'luna',
      type: 'image' as const,
      src: '/images/dogs/luna.svg',
      alt: 'Luna - A beautiful rescue dog looking for a home',
      width: 400,
      height: 400
    },
    'max': {
      id: 'max',
      type: 'image' as const,
      src: '/images/dogs/max.svg',
      alt: 'Max - A playful rescue dog ready for adoption',
      width: 400,
      height: 400
    }
  },

  // Category images for shop
  categories: {
    'accessories': {
      id: 'accessories',
      type: 'image' as const,
      src: '/images/categories/accessories.jpg',
      alt: 'Dog accessories including collars, leashes, and harnesses',
      width: 600,
      height: 400
    },
    'toys': {
      id: 'toys',
      type: 'image' as const,
      src: '/images/categories/toys.jpg',
      alt: 'Fun and stimulating dog toys',
      width: 600,
      height: 400
    },
    'care': {
      id: 'care',
      type: 'image' as const,
      src: '/images/categories/care.jpg',
      alt: 'Dog health and grooming products',
      width: 600,
      height: 400
    },
    'treats': {
      id: 'treats',
      type: 'image' as const,
      src: '/images/categories/treats.jpg',
      alt: 'Healthy natural dog treats and food',
      width: 600,
      height: 400
    },
    'portraits': {
      id: 'portraits',
      type: 'image' as const,
      src: '/images/categories/portraits.jpg',
      alt: 'Custom pet portraits and artwork',
      width: 600,
      height: 400
    },
    'apparel': {
      id: 'apparel',
      type: 'image' as const,
      src: '/images/categories/apparel.jpg',
      alt: 'Dog clothing and human apparel',
      width: 600,
      height: 400
    }
  },

  // Team photos
  team: {
    'sarah': {
      id: 'sarah',
      type: 'image' as const,
      src: '/images/team/sarah.jpg',
      alt: 'Sarah Johnson - Founder & CEO',
      width: 300,
      height: 300
    },
    'michael': {
      id: 'michael',
      type: 'image' as const,
      src: '/images/team/michael.jpg',
      alt: 'Michael Chen - Head of Operations',
      width: 300,
      height: 300
    },
    'elena': {
      id: 'elena',
      type: 'image' as const,
      src: '/images/team/elena.jpg',
      alt: 'Dr. Elena Rodriguez - Veterinary Director',
      width: 300,
      height: 300
    },
    'james': {
      id: 'james',
      type: 'image' as const,
      src: '/images/team/james.jpg',
      alt: 'James Thompson - Technology Director',
      width: 300,
      height: 300
    }
  },

  // General assets
  general: {
    'og-image': {
      id: 'og-image',
      type: 'image' as const,
      src: '/og-image.jpg',
      alt: 'Doggzy - Every Dog Deserves a Happy Ending',
      width: 1200,
      height: 630
    },
    'logo': {
      id: 'logo',
      type: 'image' as const,
      src: '/logo.png',
      alt: 'Doggzy logo',
      width: 200,
      height: 60
    }
  }
} as const

// Helper functions
export function getMediaAsset(category: keyof typeof mediaRegistry, id: string): MediaAsset | undefined {
  return mediaRegistry[category][id as keyof typeof mediaRegistry[typeof category]]
}

export function getVideoAsset(id: string): VideoAsset | undefined {
  return mediaRegistry.videos[id as keyof typeof mediaRegistry.videos]
}

export function getImageAsset(category: Exclude<keyof typeof mediaRegistry, 'videos'>, id: string): ImageAsset | undefined {
  return mediaRegistry[category][id as keyof typeof mediaRegistry[typeof category]] as ImageAsset
}

// Generate responsive image srcSet
export function generateSrcSet(baseSrc: string, sizes: number[] = [400, 800, 1200, 1600]): string {
  return sizes
    .map(size => {
      const ext = baseSrc.split('.').pop()
      const baseName = baseSrc.replace(`.${ext}`, '')
      return `${baseName}-${size}w.webp ${size}w`
    })
    .join(', ')
}

// Generate responsive sizes attribute
export function generateSizes(breakpoints: { [key: string]: string } = {
  '(max-width: 640px)': '100vw',
  '(max-width: 1024px)': '50vw',
  'default': '33vw'
}): string {
  const entries = Object.entries(breakpoints)
  const mediaQueries = entries.slice(0, -1).map(([query, size]) => `${query} ${size}`)
  const defaultSize = entries[entries.length - 1][1]
  return [...mediaQueries, defaultSize].join(', ')
}

// Check if image format is supported
export function isWebPSupported(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').startsWith('data:image/webp')
}

// Get optimized image URL
export function getOptimizedImageUrl(src: string, width?: number, height?: number, format: 'webp' | 'jpg' | 'png' = 'webp'): string {
  // For Next.js Image optimization
  if (width || height) {
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    if (format !== 'jpg') params.set('f', format)
    
    return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`
  }
  
  return src
}

// Preload critical images
export function preloadImage(src: string, as: 'image' | 'fetch' = 'image'): void {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = src
  document.head.appendChild(link)
}

// Preload critical videos
export function preloadVideo(src: string): void {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'video'
  link.href = src
  document.head.appendChild(link)
}

// Lazy load images with intersection observer
export function lazyLoadImage(img: HTMLImageElement, src: string, placeholder?: string): void {
  if (typeof window === 'undefined') return
  
  if (placeholder) {
    img.src = placeholder
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        img.src = src
        img.classList.remove('lazy')
        observer.unobserve(img)
      }
    })
  }, { threshold: 0.1 })
  
  observer.observe(img)
}

// Media file naming conventions
export const mediaConventions = {
  // Image naming: category-name-size.format
  // Examples: hero-adoption-1920w.webp, dog-bella-400w.jpg
  
  // Video naming: category-name.format
  // Examples: hero-adoption.mp4, story-success.mp4
  
  // Sizes for responsive images
  imageSizes: [400, 800, 1200, 1600, 2000],
  
  // Supported formats (in order of preference)
  imageFormats: ['webp', 'avif', 'jpg', 'png'],
  videoFormats: ['mp4', 'webm'],
  
  // Quality settings
  imageQuality: {
    thumbnail: 75,
    standard: 85,
    high: 95
  },
  
  // Compression guidelines
  compression: {
    // Target file sizes (in KB)
    thumbnail: 50,      // Small thumbnails
    card: 150,          // Card images
    hero: 500,          // Hero images
    fullsize: 1000,     // Full-size images
    
    // Video targets (in MB)
    heroVideo: 5,       // Hero background videos
    storyVideo: 10,     // Story/testimonial videos
  }
}

// TODO: Add script to convert existing images to WebP
// TODO: Add script to generate responsive image variants
// TODO: Add image optimization pipeline for new uploads
