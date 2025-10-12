#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Configuration
const config = {
  inputDir: 'public/images',
  outputDir: 'public/images/optimized',
  formats: ['webp', 'avif'],
  sizes: [400, 800, 1200, 1600, 2000],
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
    png: 90
  },
  // Skip files that are already optimized
  skipOptimized: true
}

// Ensure output directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Get all image files recursively
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList)
    } else if (/\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// Generate responsive images
async function generateResponsiveImages(inputPath, outputDir) {
  const fileName = path.basename(inputPath, path.extname(inputPath))
  const relativePath = path.relative(config.inputDir, path.dirname(inputPath))
  const outputSubDir = path.join(outputDir, relativePath)
  
  ensureDir(outputSubDir)
  
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    
    console.log(`Processing: ${inputPath}`)
    console.log(`  Original: ${metadata.width}x${metadata.height}, ${metadata.format}`)
    
    // Generate different sizes and formats
    const promises = []
    
    for (const size of config.sizes) {
      // Skip if original is smaller than target size
      if (metadata.width && metadata.width < size) continue
      
      for (const format of config.formats) {
        const outputFileName = `${fileName}-${size}w.${format}`
        const outputPath = path.join(outputSubDir, outputFileName)
        
        // Skip if file already exists and skipOptimized is true
        if (config.skipOptimized && fs.existsSync(outputPath)) {
          console.log(`  Skipping existing: ${outputFileName}`)
          continue
        }
        
        const promise = image
          .clone()
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .toFormat(format, {
            quality: config.quality[format] || 85,
            progressive: true,
            mozjpeg: format === 'jpeg'
          })
          .toFile(outputPath)
          .then(() => {
            const stats = fs.statSync(outputPath)
            console.log(`  Generated: ${outputFileName} (${Math.round(stats.size / 1024)}KB)`)
          })
          .catch(err => {
            console.error(`  Error generating ${outputFileName}:`, err.message)
          })
        
        promises.push(promise)
      }
    }
    
    // Also create optimized version of original
    const originalFormat = metadata.format === 'jpeg' ? 'jpg' : metadata.format
    const optimizedOriginal = path.join(outputSubDir, `${fileName}-original.${originalFormat}`)
    
    if (!config.skipOptimized || !fs.existsSync(optimizedOriginal)) {
      const originalPromise = image
        .clone()
        .toFormat(metadata.format, {
          quality: config.quality[metadata.format] || 85,
          progressive: true,
          mozjpeg: metadata.format === 'jpeg'
        })
        .toFile(optimizedOriginal)
        .then(() => {
          const stats = fs.statSync(optimizedOriginal)
          console.log(`  Optimized original: ${Math.round(stats.size / 1024)}KB`)
        })
        .catch(err => {
          console.error(`  Error optimizing original:`, err.message)
        })
      
      promises.push(originalPromise)
    }
    
    await Promise.all(promises)
    console.log(`  Completed: ${inputPath}\n`)
    
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message)
  }
}

// Generate srcSet helper
function generateSrcSetHelper() {
  const helperContent = `// Auto-generated image optimization helpers
// Run 'npm run optimize-images' to regenerate

export function generateSrcSet(baseName: string, sizes: number[] = [400, 800, 1200, 1600]): string {
  return sizes
    .map(size => \`/images/optimized/\${baseName}-\${size}w.webp \${size}w\`)
    .join(', ')
}

export function generateAvifSrcSet(baseName: string, sizes: number[] = [400, 800, 1200, 1600]): string {
  return sizes
    .map(size => \`/images/optimized/\${baseName}-\${size}w.avif \${size}w\`)
    .join(', ')
}

export function getOptimizedImageUrl(baseName: string, size: number, format: 'webp' | 'avif' = 'webp'): string {
  return \`/images/optimized/\${baseName}-\${size}w.\${format}\`
}

// Common responsive sizes
export const responsiveSizes = {
  mobile: '(max-width: 640px) 100vw',
  tablet: '(max-width: 1024px) 50vw', 
  desktop: '33vw'
}

export function generateSizes(breakpoints: Record<string, string> = responsiveSizes): string {
  const entries = Object.entries(breakpoints)
  const mediaQueries = entries.slice(0, -1).map(([query, size]) => \`\${query} \${size}\`)
  const defaultSize = entries[entries.length - 1][1]
  return [...mediaQueries, defaultSize].join(', ')
}
`

  fs.writeFileSync('src/lib/image-helpers.ts', helperContent)
  console.log('Generated image helper utilities at src/lib/image-helpers.ts')
}

// Main function
async function main() {
  console.log('🖼️  Starting image optimization...\n')
  
  if (!fs.existsSync(config.inputDir)) {
    console.error(`Input directory ${config.inputDir} does not exist`)
    process.exit(1)
  }
  
  ensureDir(config.outputDir)
  
  const imageFiles = getImageFiles(config.inputDir)
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize')
    return
  }
  
  console.log(`Found ${imageFiles.length} images to process\n`)
  
  // Process images in batches to avoid overwhelming the system
  const batchSize = 5
  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize)
    await Promise.all(
      batch.map(file => generateResponsiveImages(file, config.outputDir))
    )
  }
  
  // Generate helper utilities
  generateSrcSetHelper()
  
  console.log('✅ Image optimization complete!')
  console.log(`Processed ${imageFiles.length} images`)
  console.log(`Output directory: ${config.outputDir}`)
}

// Check if sharp is installed
try {
  require.resolve('sharp')
} catch (e) {
  console.error('Sharp is not installed. Please run: npm install sharp --save-dev')
  process.exit(1)
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main, config }