'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Edit, 
  Save, 
  X, 
  Plus,
  Search,
  Eye,
  Globe,
  Home,
  ShoppingBag,
  Heart,
  Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface ContentItem {
  id: string
  page: string
  section: string
  key: string
  value: string
  type: 'text' | 'textarea' | 'rich-text'
  lastModified: string
}

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPage, setSelectedPage] = useState('all')
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // Mock content data - replace with real data
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      page: 'home',
      section: 'hero',
      key: 'title',
      value: 'Svaki pas zaslužuje',
      type: 'text',
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      page: 'home',
      section: 'hero',
      key: 'titleHighlight',
      value: 'Srećan završetak',
      type: 'text',
      lastModified: '2024-01-15'
    },
    {
      id: '3',
      page: 'home',
      section: 'hero',
      key: 'subtitle',
      value: 'Pridružite se našem globalnom pokretu za spašavanje, rehabilitaciju i pronalaženje novih domova za pse u nuždi.',
      type: 'textarea',
      lastModified: '2024-01-15'
    },
    {
      id: '4',
      page: 'about',
      section: 'hero',
      key: 'title',
      value: 'O nama',
      type: 'text',
      lastModified: '2024-01-14'
    },
    {
      id: '5',
      page: 'contact',
      section: 'info',
      key: 'email',
      value: 'info@doggzy.rs',
      type: 'text',
      lastModified: '2024-01-14'
    },
    {
      id: '6',
      page: 'contact',
      section: 'info',
      key: 'phone',
      value: '+381 11 123 4567',
      type: 'text',
      lastModified: '2024-01-14'
    }
  ])

  const pages = [
    { value: 'all', label: 'Sve stranice', icon: Globe },
    { value: 'home', label: 'Početna', icon: Home },
    { value: 'about', label: 'O nama', icon: FileText },
    { value: 'contact', label: 'Kontakt', icon: Phone },
    { value: 'donate', label: 'Donacije', icon: Heart },
    { value: 'shop', label: 'Prodavnica', icon: ShoppingBag }
  ]

  const filteredItems = contentItems.filter(item => {
    const matchesSearch = 
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.section.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPage = selectedPage === 'all' || item.page === selectedPage
    return matchesSearch && matchesPage
  })

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item.id)
    setEditValue(item.value)
  }

  const handleSave = (itemId: string) => {
    setContentItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, value: editValue, lastModified: new Date().toISOString().split('T')[0] }
        : item
    ))
    setEditingItem(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingItem(null)
    setEditValue('')
  }

  const getPageIcon = (page: string) => {
    const pageConfig = pages.find(p => p.value === page)
    return pageConfig?.icon || FileText
  }

  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = `${item.page}-${item.section}`
    if (!acc[key]) {
      acc[key] = {
        page: item.page,
        section: item.section,
        items: []
      }
    }
    acc[key].items.push(item)
    return acc
  }, {} as Record<string, { page: string, section: string, items: ContentItem[] }>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upravljanje sadržajem</h1>
          <p className="mt-2 text-gray-600">
            Uredite tekstove, naslove i opise na vašem sajtu.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Plus className="h-4 w-4 mr-2" />
            Dodaj sadržaj
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Ukupno stavki</p>
                <p className="text-lg font-semibold">{contentItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Stranice</p>
                <p className="text-lg font-semibold">{new Set(contentItems.map(item => item.page)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Poslednje izmene</p>
                <p className="text-lg font-semibold">Danas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">Objavljeno</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pretraži sadržaj..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {pages.map(page => (
                  <option key={page.value} value={page.value}>
                    {page.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Items */}
      <div className="space-y-6">
        {Object.values(groupedItems).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedPage !== 'all' ? 'Nema rezultata' : 'Nema sadržaja'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedPage !== 'all' 
                  ? 'Pokušajte sa drugačijim kriterijumima pretrage.'
                  : 'Dodajte prvi sadržaj da počnete.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.values(groupedItems).map((group) => {
            const PageIcon = getPageIcon(group.page)
            return (
              <Card key={`${group.page}-${group.section}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PageIcon className="h-5 w-5 text-orange-500" />
                    <span className="capitalize">{group.page}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600 capitalize">{group.section}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {item.key}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Izmenjeno: {item.lastModified}
                          </span>
                          {editingItem !== item.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {editingItem === item.id ? (
                        <div className="space-y-3">
                          {item.type === 'textarea' ? (
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={4}
                              className="w-full"
                            />
                          ) : (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full"
                            />
                          )}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(item.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Sačuvaj
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Otkaži
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-900">
                          {item.type === 'textarea' ? (
                            <p className="whitespace-pre-wrap">{item.value}</p>
                          ) : (
                            <p>{item.value}</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Kako da upravljate sadržajem?
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>• Kliknite na dugme &quot;Uredi&quot; pored bilo koje stavke da je izmenite</p>
                <p>• Koristite pretragu da brzo pronađete specifičan sadržaj</p>
                <p>• Filtrirajte po stranicama da vidite sadržaj određene stranice</p>
                <p>• Sve izmene se automatski čuvaju i odmah se prikazuju na sajtu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
