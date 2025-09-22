#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images for web use:
 * - Converts JPG/PNG to WebP format
 * - Generates responsive image variants
 * - Compresses images to target file sizes
 * - Creates thumbnails
 * 
 * Usage:
 *   node scripts/optimize-images.js [source-dir] [output-dir]
 * 
 * Requirements:
 *   npm install sharp
 */

const fs = require('fs').promises
const path = require('path')

// Configuration
const config = {
  // Image sizes to generate
  sizes: [400, 800, 1200, 1600, 2000],
  
  // Quality settings
  quality: {
    webp: 85,
    jpeg: 85,
    png: 95
  },
  
  // Supported input formats
  inputFormats: ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'],
  
  // Output formats to generate
  outputFormats: ['webp', 'jpg'], // WebP first for modern browsers
  
  // Thumbnail size
  thumbnailSize: 300
}

async function optimizeImages(sourceDir = 'public/images', outputDir = 'public/images/optimized') {
  console.log('🖼️  Starting image optimization...')
  console.log(`Source: ${sourceDir}`)
  console.log(`Output: ${outputDir}`)
  
  try {
    // Check if sharp is installed
    const sharp = require('sharp')
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true })
    
    // Find all images in source directory
    const images = await findImages(sourceDir)
    console.log(`Found ${images.length} images to optimize`)
    
    let processed = 0
    let errors = 0
    
    // Process each image
    for (const imagePath of images) {
      try {
        await processImage(imagePath, sourceDir, outputDir, sharp)
        processed++
        console.log(`✅ Processed: ${path.basename(imagePath)} (${processed}/${images.length})`)
      } catch (error) {
        errors++
        console.error(`❌ Error processing ${imagePath}:`, error.message)
      }
    }
    
    console.log('\n🎉 Optimization complete!')
    console.log(`✅ Successfully processed: ${processed} images`)
    if (errors > 0) {
      console.log(`❌ Errors: ${errors} images`)
    }
    
    // Generate optimization report
    await generateReport(outputDir, processed, errors)
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('sharp')) {
      console.error('❌ Sharp is not installed. Please run: npm install sharp')
      console.error('   Sharp is required for image optimization.')
      process.exit(1)
    }
    
    console.error('❌ Optimization failed:', error.message)
    process.exit(1)
  }
}

async function findImages(dir) {
  const images = []
  
  async function scanDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        await scanDir(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (config.inputFormats.includes(ext)) {
          images.push(fullPath)
        }
      }
    }
  }
  
  await scanDir(dir)
  return images
}

async function processImage(imagePath, sourceDir, outputDir, sharp) {
  const relativePath = path.relative(sourceDir, imagePath)
  const parsedPath = path.parse(relativePath)
  const baseName = parsedPath.name
  const outputSubDir = path.join(outputDir, parsedPath.dir)
  
  // Ensure output subdirectory exists
  await fs.mkdir(outputSubDir, { recursive: true })
  
  // Load image and get metadata
  const image = sharp(imagePath)
  const metadata = await image.metadata()
  
  console.log(`  Processing: ${baseName} (${metadata.width}×${metadata.height})`)
  
  // Generate responsive variants for each format
  for (const format of config.outputFormats) {
    for (const size of config.sizes) {
      // Skip if source image is smaller than target size
      if (metadata.width && metadata.width < size) continue
      
      const outputPath = path.join(outputSubDir, `${baseName}-${size}w.${format}`)
      
      await image
        .clone()
        .resize(size, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .toFormat(format, { 
          quality: config.quality[format] || config.quality.webp 
        })
        .toFile(outputPath)
    }
    
    // Generate thumbnail
    const thumbnailPath = path.join(outputSubDir, `${baseName}-thumb.${format}`)
    await image
      .clone()
      .resize(config.thumbnailSize, config.thumbnailSize, {
        fit: 'cover',
        position: 'center'
      })
      .toFormat(format, { 
        quality: config.quality[format] || config.quality.webp 
      })
      .toFile(thumbnailPath)
  }
  
  // Also create an optimized version in original format
  const originalFormat = metadata.format
  if (originalFormat && ['jpeg', 'png', 'webp'].includes(originalFormat)) {
    const optimizedPath = path.join(outputSubDir, `${baseName}-optimized.${originalFormat === 'jpeg' ? 'jpg' : originalFormat}`)
    
    await image
      .clone()
      .toFormat(originalFormat, { 
        quality: config.quality[originalFormat] || 85
      })
      .toFile(optimizedPath)
  }
}

async function generateReport(outputDir, processed, errors) {
  const report = {
    timestamp: new Date().toISOString(),
    processed,
    errors,
    config,
    files: []
  }
  
  // Scan output directory for file sizes
  async function scanOutput(dir, prefix = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.join(prefix, entry.name)
      
      if (entry.isDirectory()) {
        await scanOutput(fullPath, relativePath)
      } else if (entry.isFile()) {
        const stats = await fs.stat(fullPath)
        report.files.push({
          path: relativePath,
          size: stats.size,
          sizeKB: Math.round(stats.size / 1024)
        })
      }
    }
  }
  
  try {
    await scanOutput(outputDir)
    
    // Sort by size (largest first)
    report.files.sort((a, b) => b.size - a.size)
    
    const reportPath = path.join(outputDir, 'optimization-report.json')
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2))
    
    console.log(`📊 Report generated: ${reportPath}`)
    
    // Show summary
    const totalSize = report.files.reduce((sum, file) => sum + file.size, 0)
    const totalSizeMB = Math.round(totalSize / 1024 / 1024 * 100) / 100
    
    console.log(`📈 Total optimized files: ${report.files.length}`)
    console.log(`📦 Total size: ${totalSizeMB} MB`)
    
  } catch (error) {
    console.warn('⚠️  Could not generate report:', error.message)
  }
}

// Run if called directly
if (require.main === module) {
  const [,, sourceDir, outputDir] = process.argv
  optimizeImages(sourceDir, outputDir)
}

module.exports = { optimizeImages }