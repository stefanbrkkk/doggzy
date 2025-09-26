'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2,
  Download,
  Search,
  Grid,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AnimatedPage } from '@/components/animated-page'

interface MediaFile {
  filename: string
  url: string
  size: number
  modified: Date
  type: 'stories' | 'dogs'
  slug: string
}

export default function AdminMedia() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load media files
  useEffect(() => {
    const loadMediaFiles = async () => {
      try {
        setIsLoading(true)
        
        // Load files from both stories and dogs directories
        const [storiesResponse, dogsResponse] = await Promise.all([
          fetch('/api/admin/media/list?type=stories&slug=general'),
          fetch('/api/admin/media/list?type=dogs&slug=general')
        ])
        
        const [storiesData, dogsData] = await Promise.all([
          storiesResponse.json(),
          dogsResponse.json()
        ])
        
        const allFiles: MediaFile[] = []
        
        if (storiesData.success) {
          allFiles.push(...storiesData.data.files.map((f: { filename: string; url: string; size: number; modified: string }) => ({ ...f, type: 'stories' as const, slug: 'general' })))
        }
        
        if (dogsData.success) {
          allFiles.push(...dogsData.data.files.map((f: { filename: string; url: string; size: number; modified: string }) => ({ ...f, type: 'dogs' as const, slug: 'general' })))
        }
        
        setMediaFiles(allFiles)
      } catch (error) {
        console.error('Failed to load media files:', error)
        // Set empty array on error to prevent crashes
        setMediaFiles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMediaFiles()
  }, [])

  // Filter media files
  const filteredFiles = mediaFiles.filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    
    try {
      setIsUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'stories') // Default to stories
      formData.append('slug', 'general') // Default slug
      formData.append('alt', file.name.replace(/\.[^/.]+$/, '')) // Remove extension for alt

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Reload media files
          const [storiesResponse, dogsResponse] = await Promise.all([
            fetch('/api/admin/media/list?type=stories&slug=general'),
            fetch('/api/admin/media/list?type=dogs&slug=general')
          ])
          
          const [storiesData, dogsData] = await Promise.all([
            storiesResponse.json(),
            dogsResponse.json()
          ])
          
          const allFiles: MediaFile[] = []
          
          if (storiesData.success) {
            allFiles.push(...storiesData.data.files.map((f: { filename: string; url: string; size: number; modified: string }) => ({ ...f, type: 'stories' as const, slug: 'general' })))
          }
          
          if (dogsData.success) {
            allFiles.push(...dogsData.data.files.map((f: { filename: string; url: string; size: number; modified: string }) => ({ ...f, type: 'dogs' as const, slug: 'general' })))
          }
          
          setMediaFiles(allFiles)
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteFile = async (filename: string, type: string, slug: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return
    
    try {
      const response = await fetch('/api/admin/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, type, slug })
      })
      
      if (response.ok) {
        setMediaFiles(mediaFiles.filter(f => f.filename !== filename))
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-neon-accent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading media library...</span>
        </div>
      </div>
    )
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto container-padding py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display text-3xl font-bold text-foreground">Media Library</h1>
                <p className="text-body text-muted-foreground">Upload and manage images</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="glow"
                  className="glow-accent group"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading... {uploadProgress}%
                    </span>
                  ) : (
                    'Upload Image'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto container-padding py-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Files */}
          {filteredFiles.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.filename}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className={`card group hover:border-neon-accent/30 transition-all duration-300 ${
                    viewMode === 'grid' ? 'p-4' : 'p-6 flex items-center gap-4'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{file.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <a href={file.url} download target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteFile(file.filename, file.type, file.slug)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">{file.filename}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{file.type}</span>
                          <span>{new Date(file.modified).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={file.url} download target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteFile(file.filename, file.type, file.slug)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No media files found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Try adjusting your search term'
                  : 'Upload your first image to get started'
                }
              </p>
              <Button
                variant="glow"
                className="glow-accent"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload First Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  )
}