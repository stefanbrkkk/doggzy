# Media Management Guide

This guide explains how to manage media assets (images and videos) in the Doggzy platform.

## Overview

The media system is designed to:
- Provide optimized images and videos for web performance
- Support responsive images for different screen sizes
- Maintain organized asset structure
- Enable easy content management

## Directory Structure

```
public/
├── images/
│   ├── dogs/                 # Dog photos and illustrations
│   ├── categories/           # Shop category images
│   ├── team/                 # Team member photos
│   ├── thumbnails/           # Video thumbnails
│   └── optimized/            # Generated responsive variants
├── videos/                   # Video assets
├── og-image.jpg              # Social media preview image
└── logo.png                  # Main logo
```

## Image Guidelines

### Formats
- **Primary**: WebP (modern browsers, best compression)
- **Fallback**: JPEG (universal compatibility)
- **Avoid**: PNG for photos (use only for graphics with transparency)

### Sizes
We generate responsive variants at these widths:
- 400px (mobile)
- 800px (tablet)
- 1200px (desktop)
- 1600px (large desktop)
- 2000px (retina displays)

### Quality Settings
- **Thumbnails**: 75% quality (small file size priority)
- **Standard**: 85% quality (balanced)
- **High**: 95% quality (hero images only)

### Naming Convention
```
category-name-size.format
```

Examples:
- `hero-adoption-1200w.webp`
- `dog-bella-400w.jpg`
- `category-toys-800w.webp`

## Video Guidelines

### Formats
- **Primary**: MP4 (H.264)
- **Progressive**: WebM (where supported)

### Specifications
- **Hero Videos**: 
  - Max 5MB file size
  - 30 seconds or less
  - 1920×1080 max resolution
  - Muted by default
  - Loop enabled

### Naming Convention
```
category-name.format
```

Examples:
- `hero-adoption.mp4`
- `story-success.mp4`

## Using Media in Code

### Images with Media Registry

```typescript
import { getImageAsset, generateSrcSet } from '@/lib/media'

// Get a specific image asset
const dogImage = getImageAsset('dogs', 'bella')

// Generate responsive srcSet
const srcSet = generateSrcSet(dogImage.src)
```

### Next.js Image Component

```tsx
import Image from 'next/image'
import { getImageAsset } from '@/lib/media'

const asset = getImageAsset('dogs', 'bella')

<Image
  src={asset.src}
  alt={asset.alt}
  width={asset.width}
  height={asset.height}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  priority // Only for above-the-fold images
/>
```

### Videos

```tsx
import { getVideoAsset } from '@/lib/media'

const video = getVideoAsset('hero-default')

<video
  src={video.src}
  poster={video.thumbnail}
  autoPlay={video.autoplay}
  muted={video.muted}
  loop={video.loop}
  aria-label={video.alt}
>
  Your browser does not support the video tag.
</video>
```

## Content Management

### Adding New Images

1. **Place original image** in appropriate `public/images/` subdirectory
2. **Run optimization script**: `node scripts/optimize-images.js`
3. **Update media registry** in `src/lib/media.ts`
4. **Update content files** to reference the new asset

### Image Optimization Script

```bash
# Optimize all images in public/images/
node scripts/optimize-images.js

# Optimize specific directory
node scripts/optimize-images.js public/images/dogs public/images/optimized/dogs
```

The script will:
- Convert images to WebP format
- Generate responsive variants
- Create thumbnails
- Compress to target file sizes
- Generate optimization report

### Manual Optimization

If you need to manually optimize images:

1. **Install Sharp** (if not already installed):
   ```bash
   npm install sharp
   ```

2. **Use online tools**:
   - [Squoosh](https://squoosh.app/) - Google's image optimization tool
   - [TinyPNG](https://tinypng.com/) - PNG/JPEG compression
   - [Convertio](https://convertio.co/) - Format conversion

3. **Command line tools**:
   ```bash
   # Convert to WebP
   cwebp -q 85 input.jpg -o output.webp
   
   # Resize image
   convert input.jpg -resize 800x output.jpg
   ```

## Performance Best Practices

### Image Loading
- Use `priority` prop for above-the-fold images
- Lazy load below-the-fold images (default behavior)
- Provide appropriate `sizes` attribute
- Use placeholder images for better UX

### Video Loading
- Preload critical hero videos
- Use poster images for video thumbnails
- Keep file sizes under 5MB for hero videos
- Consider lazy loading for non-critical videos

### Responsive Images
```tsx
// Good: Responsive with proper sizes
<Image
  src="/images/hero.jpg"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  fill
/>

// Bad: Fixed size that doesn't adapt
<Image
  src="/images/hero.jpg"
  width={1200}
  height={600}
/>
```

## Accessibility

### Alt Text Guidelines
- **Descriptive**: Describe what's in the image
- **Contextual**: Consider the image's purpose
- **Concise**: Keep under 125 characters
- **Empty for decorative**: Use `alt=""` for purely decorative images

Examples:
```typescript
// Good
alt: "Bella, a golden retriever, playing in a sunny park with her new family"

// Bad
alt: "dog image"
alt: "IMG_1234.jpg"
```

### Video Accessibility
- Provide captions for videos with speech
- Use `aria-label` for background videos
- Ensure videos don't auto-play with sound
- Provide controls for user-initiated videos

## File Size Targets

### Images
- **Thumbnails**: < 50KB
- **Card Images**: < 150KB
- **Hero Images**: < 500KB
- **Full-size Images**: < 1MB

### Videos
- **Hero Videos**: < 5MB
- **Story Videos**: < 10MB

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check file paths are correct
   - Verify files exist in public directory
   - Check Next.js image domains configuration

2. **Poor performance**
   - Ensure responsive images are being used
   - Check if images are too large
   - Verify WebP format is being served

3. **Optimization script errors**
   - Make sure Sharp is installed: `npm install sharp`
   - Check file permissions
   - Verify source directory exists

### Debug Commands

```bash
# Check image file sizes
du -sh public/images/**/*.{jpg,png,webp}

# List large files
find public/images -type f -size +500k

# Check WebP support
node -e "console.log(require('sharp').format)"
```

## Future Enhancements

Planned improvements:
- [ ] Automatic image optimization on upload
- [ ] CDN integration for global delivery
- [ ] Advanced compression algorithms
- [ ] Automatic format detection and serving
- [ ] Image analytics and performance monitoring