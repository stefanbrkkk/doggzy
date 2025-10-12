'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Grid,
  List,
  DollarSign,
  Package,
  Star,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  status: 'active' | 'draft' | 'out-of-stock'
  images: string[]
  stock: number
  sales: number
  rating: number
  createdAt: string
}

export default function ProductManagement() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  // const [showAddModal, setShowAddModal] = useState(false) // TODO: Implement add modal

  // Mock product data - replace with real data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Doggzy majica - Crna',
      description: 'Kvalitetna pamučna majica sa Doggzy logom. Sav profit ide u spašavanje pasa.',
      price: 2500,
      originalPrice: 3000,
      category: 'clothing',
      status: 'active',
      images: ['/api/placeholder/300/300'],
      stock: 25,
      sales: 12,
      rating: 4.8,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Doggzy šolja',
      description: 'Keramička šolja sa motivacionom porukom za ljubitelje pasa.',
      price: 1200,
      category: 'accessories',
      status: 'active',
      images: ['/api/placeholder/300/300'],
      stock: 50,
      sales: 8,
      rating: 4.6,
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Doggzy kalendar 2024',
      description: 'Kalendar sa prekrasnim fotografijama spašenih pasa.',
      price: 800,
      category: 'accessories',
      status: 'draft',
      images: ['/api/placeholder/300/300'],
      stock: 0,
      sales: 0,
      rating: 0,
      createdAt: '2024-01-13'
    }
  ])

  const categories = [
    { value: 'all', label: 'Sve kategorije' },
    { value: 'clothing', label: 'Odeća' },
    { value: 'accessories', label: 'Dodaci' },
    { value: 'toys', label: 'Igračke' },
    { value: 'food', label: 'Hrana' },
    { value: 'other', label: 'Ostalo' }
  ]

  const statuses = [
    { value: 'all', label: 'Svi statusi' },
    { value: 'active', label: 'Aktivni' },
    { value: 'draft', label: 'Nacrt' },
    { value: 'out-of-stock', label: 'Nema na stanju' }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktivan</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Nacrt</Badge>
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-800">Nema na stanju</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.label || category
  }

  const totalRevenue = products.reduce((sum, product) => sum + (product.price * product.sales), 0)
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0)
  const activeProducts = products.filter(p => p.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upravljanje proizvodima</h1>
          <p className="mt-2 text-gray-600">
            Dodajte, uredite i upravljajte proizvodima u vašoj prodavnici.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => console.log('Add product modal - TODO')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Dodaj proizvod
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Ukupno proizvoda</p>
                <p className="text-lg font-semibold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Aktivni proizvodi</p>
                <p className="text-lg font-semibold">{activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Ukupne prodaje</p>
                <p className="text-lg font-semibold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Ukupan prihod</p>
                <p className="text-lg font-semibold">{totalRevenue.toLocaleString()} RSD</p>
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
                  placeholder="Pretraži proizvode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <Card>
        <CardContent className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' ? 'Nema rezultata' : 'Nema proizvoda'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Pokušajte sa drugačijim kriterijumima pretrage.'
                  : 'Dodajte prvi proizvod da počnete.'
                }
              </p>
              {!searchQuery && filterCategory === 'all' && filterStatus === 'all' && (
                <Button
                  onClick={() => console.log('Add product modal - TODO')}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj proizvod
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`
                    border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200
                    ${viewMode === 'grid' ? '' : 'p-4'}
                  `}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Grid View */}
                      <div className="aspect-square bg-gray-100 relative">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(product.status)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-gray-900">
                              {product.price.toLocaleString()} RSD
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.originalPrice.toLocaleString()} RSD
                              </span>
                            )}
                          </div>
                          {product.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(product.category)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Stanje: {product.stock}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Pregled
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {product.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(product.category)}
                                </Badge>
                                {getStatusBadge(product.status)}
                                <span className="text-sm text-gray-500">
                                  Stanje: {product.stock}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Prodaje: {product.sales}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-gray-900">
                                {product.price.toLocaleString()} RSD
                              </div>
                              {product.originalPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  {product.originalPrice.toLocaleString()} RSD
                                </div>
                              )}
                              {product.rating > 0 && (
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm text-gray-600">{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Upravljanje proizvodima
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>• Dodajte nove proizvode klikom na &quot;Dodaj proizvod&quot;</p>
                <p>• Koristite filtere da brzo pronađete određene proizvode</p>
                <p>• Sve prodaje direktno podržavaju spašavanje pasa</p>
                <p>• Redovno ažurirajte stanje proizvoda</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
