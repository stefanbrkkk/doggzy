export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  tags: string[]
  description: string
  inStock: boolean
  isEcoFriendly?: boolean
  isBestSeller?: boolean
  isNew?: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Orthopedic Memory Foam Bed',
    price: 119,
    originalPrice: 149,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 980,
    category: 'Furniture',
    tags: ['Memory Foam', 'Machine Washable', 'Joint Support'],
    description: 'Premium orthopedic dog bed with cooling memory foam and washable cover.',
    inStock: true,
    isEcoFriendly: true,
    isBestSeller: true
  },
  {
    id: '2',
    name: 'No-Pull Harness (Eco Webbing)',
    price: 39,
    image: '/api/placeholder/400/400',
    rating: 4.8,
    reviewCount: 730,
    category: 'Accessories',
    tags: ['No Pull', 'Padded', 'Recycled'],
    description: 'Front-clip harness made from recycled webbing with breathable padding.',
    inStock: true,
    isEcoFriendly: true,
    isBestSeller: true
  },
  {
    id: '3',
    name: 'GPS Tracking Collar Pro',
    price: 99,
    image: '/api/placeholder/400/400',
    rating: 4.7,
    reviewCount: 560,
    category: 'Technology',
    tags: ['GPS', 'Waterproof', 'Long Battery'],
    description: 'Real-time GPS tracking with geofencing and multi-day battery life.',
    inStock: true,
    isNew: true
  },
  {
    id: '4',
    name: 'Interactive Puzzle Feeder',
    price: 28,
    image: '/api/placeholder/400/400',
    rating: 4.6,
    reviewCount: 410,
    category: 'Toys',
    tags: ['Enrichment', 'Slow Feed', 'Durable'],
    description: 'Mental stimulation puzzle feeder that slows down eating and reduces boredom.',
    inStock: true,
    isBestSeller: true
  },
  {
    id: '5',
    name: 'Eco-Friendly Rope Toy (3-Pack)',
    price: 22,
    image: '/api/placeholder/400/400',
    rating: 4.5,
    reviewCount: 320,
    category: 'Toys',
    tags: ['Organic Cotton', 'Dental', 'Durable'],
    description: 'Organic cotton rope toys that help clean teeth and satisfy chewing needs.',
    inStock: true,
    isEcoFriendly: true
  },
  {
    id: '6',
    name: 'Stainless Travel Water Bottle',
    price: 29,
    image: '/api/placeholder/400/400',
    rating: 4.6,
    reviewCount: 455,
    category: 'Travel',
    tags: ['Leak-proof', 'BPA-Free', 'Portable'],
    description: 'Leak-proof travel bottle with integrated bowl for on-the-go hydration.',
    inStock: true,
    isNew: true
  },
  {
    id: '7',
    name: 'Calming Donut Bed',
    price: 59,
    image: '/api/placeholder/400/400',
    rating: 4.7,
    reviewCount: 610,
    category: 'Furniture',
    tags: ['Cozy', 'Anti-Anxiety', 'Washable'],
    description: 'Ultra-plush donut bed designed to reduce anxiety and improve sleep.',
    inStock: true
  },
  {
    id: '8',
    name: 'Organic Training Treats',
    price: 15,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 1290,
    category: 'Food',
    tags: ['Organic', 'Low Cal', 'High Value'],
    description: 'Soft, bite-sized training treats made with organic ingredients.',
    inStock: true,
    isEcoFriendly: true,
    isBestSeller: true
  },
  {
    id: '9',
    name: 'Vet-Safe Grooming Kit',
    price: 45,
    image: '/api/placeholder/400/400',
    rating: 4.6,
    reviewCount: 270,
    category: 'Grooming',
    tags: ['Quiet', 'Cordless', 'All Breeds'],
    description: 'Low-noise clippers and tools recommended by groomers and vets.',
    inStock: true
  },
  {
    id: '10',
    name: 'Reflective Weatherproof Jacket',
    price: 49,
    image: '/api/placeholder/400/400',
    rating: 4.7,
    reviewCount: 380,
    category: 'Apparel',
    tags: ['Reflective', 'Waterproof', 'Adjustable'],
    description: 'All-weather jacket with reflective panels and adjustable fit.',
    inStock: true
  },
  {
    id: '11',
    name: 'Elevated Cooling Bowl',
    price: 34,
    image: '/api/placeholder/400/400',
    rating: 4.5,
    reviewCount: 190,
    category: 'Accessories',
    tags: ['Cooling', 'Non-Slip', 'Dishwasher Safe'],
    description: 'Elevated stainless steel bowl with cooling core to keep water fresh.',
    inStock: true
  },
  {
    id: '12',
    name: 'Custom Dog Portrait Hoodie',
    price: 49,
    originalPrice: 65,
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 540,
    category: 'Apparel',
    tags: ['Custom', 'Organic Cotton', 'Personalized'],
    description: 'High-quality hoodie with your dog’s portrait. Premium organic cotton.',
    inStock: true,
    isEcoFriendly: true,
    isBestSeller: true
  }
]


