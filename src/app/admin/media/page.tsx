'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File, 
  Trash2, 
  Download, 
  Eye,
  Search,
  Grid,
  List,
  Plus,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: string
  uploadDate: string
  url: string
  category: string
}

export default function MediaManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data - replace with real data
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-image.jpg',
      type: 'image',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      url: '/api/placeholder/800/600',
      category: 'hero'
    },
    {
      id: '2',
      name: 'dog-rescue-video.mp4',
      type: 'video',
      size: '15.2 MB',
      uploadDate: '2024-01-14',
      url: '/videos/rescue.mp4',
      category: 'stories'
    }
  ])

  const categories = [
    { value: 'all', label: 'Sve kategorije' },
    { value: 'hero', label: 'Hero sekcija' },
    { value: 'stories', label: 'Priče' },
    { value: 'products', label: 'Proizvodi' },
    { value: 'team', label: 'Tim' },
    { value: 'other', label: 'Ostalo' }
  ]

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || file.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    
    // Simulate upload process
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const newFile: MediaFile = {
        id: Date.now().toString() + i,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
        category: 'other'
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMediaFiles(prev => [...prev, newFile])
    }
    
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (fileId: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== fileId))
    setSelectedFiles(prev => prev.filter(id => id !== fileId))
  }

  const handleBulkDelete = () => {
    setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      default: return File
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-slide-up">
        <div>
          <h1 className="text-4xl lg:text-5xl font-display font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift">
            Upravljanje medijima
          </h1>
          <p className="mt-3 text-lg text-white/70 max-w-2xl">
            Otpremite i organizujte slike, videe i druge fajlove za vaš sajt sa naprednim alatima za upravljanje.
          </p>
        </div>
        <div className="mt-6 sm:mt-0 animate-slide-in-right">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="glow"
            size="lg"
            className="hover:scale-105 transition-all duration-300 shadow-glow-lg"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Otpremanje...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-3" />
                Otpremi fajlove
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border border-white/10 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl glass-subtle group-hover:scale-110 transition-all duration-300">
                <ImageIcon className="h-6 w-6 text-blue-400 animate-pulse-glow" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Slike</p>
                <p className="text-2xl font-bold text-white">{mediaFiles.filter(f => f.type === 'image').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border border-white/10 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl glass-subtle group-hover:scale-110 transition-all duration-300">
                <Video className="h-6 w-6 text-green-400 animate-pulse-glow" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Videi</p>
                <p className="text-2xl font-bold text-white">{mediaFiles.filter(f => f.type === 'video').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border border-white/10 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl glass-subtle group-hover:scale-110 transition-all duration-300">
                <File className="h-6 w-6 text-purple-400 animate-pulse-glow" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Dokumenti</p>
                <p className="text-2xl font-bold text-white">{mediaFiles.filter(f => f.type === 'document').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border border-white/10 shadow-glass hover:shadow-glass-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl glass-subtle group-hover:scale-110 transition-all duration-300">
                <Upload className="h-6 w-6 text-orange-400 animate-pulse-glow" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white/60 uppercase tracking-wider">Ukupno</p>
                <p className="text-2xl font-bold text-white">{mediaFiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Controls */}
      <Card className="glass-card border border-white/10 shadow-glass-lg">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <Input
                  placeholder="Pretraži fajlove..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full sm:w-80 h-12 glass-subtle border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 h-12 glass-subtle border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white bg-transparent backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-slate-800">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedFiles.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="hover:scale-105 transition-all duration-300 shadow-glow"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Obriši ({selectedFiles.length})
                </Button>
              )}
              <div className="flex glass-subtle border border-white/20 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'glow' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none border-0 hover:scale-105 transition-all duration-300"
                >
                  <Grid className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'glow' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-0 hover:scale-105 transition-all duration-300"
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Media Grid/List */}
      <Card className="glass-card border border-white/10 shadow-glass-lg">
        <CardContent className="p-8">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-16 animate-slide-up">
              <div className="relative mb-8">
                <Upload className="h-20 w-20 text-white/40 mx-auto animate-float" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery || filterCategory !== 'all' ? 'Nema rezultata' : 'Nema otpremljenih fajlova'}
              </h3>
              <p className="text-white/70 mb-8 text-lg max-w-md mx-auto">
                {searchQuery || filterCategory !== 'all' 
                  ? 'Pokušajte sa drugačijim kriterijumima pretrage.'
                  : 'Otpremite prvi fajl da počnete sa upravljanjem medijima.'
                }
              </p>
              {!searchQuery && filterCategory === 'all' && (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="glow"
                  size="lg"
                  className="hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Otpremi fajlove
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : "space-y-2"
            }>
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type)
                const isSelected = selectedFiles.includes(file.id)
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
                      relative group border rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
                      ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}
                      ${viewMode === 'grid' ? 'aspect-square' : 'p-4'}
                    `}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                          {file.type === 'image' ? (
                            <Image
                              src={file.url}
                              alt={file.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FileIcon className="h-12 w-12 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex space-x-1">
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(file.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{file.size}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {file.type === 'image' ? (
                              <Image
                                src={file.url}
                                alt={file.name}
                                width={48}
                                height={48}
                                className="object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                <FileIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{file.name}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {file.category}
                              </Badge>
                              <span className="text-sm text-gray-500">{file.size}</span>
                              <span className="text-sm text-gray-500">{file.uploadDate}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(file.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
