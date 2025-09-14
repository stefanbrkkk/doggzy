'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Star, ArrowRight, Quote } from 'lucide-react'

export function SuccessStories() {
  const stories = [
    {
      id: 1,
      name: "Bella",
      breed: "Golden Retriever Mix",
      age: "3 years old",
      image: "🐕",
      story: "Bella was found abandoned in a parking lot, malnourished and scared. Through our rescue program, she received medical care, love, and training. Today, she's living her best life with the Johnson family and has become a therapy dog, bringing joy to nursing home residents.",
      adopter: "Sarah Johnson",
      location: "Austin, TX",
      rating: 5,
      timeAgo: "6 months ago"
    },
    {
      id: 2,
      name: "Max",
      breed: "German Shepherd",
      age: "5 years old", 
      image: "🐕‍🦺",
      story: "Max was surrendered by his previous family due to financial difficulties. Our partner shelter provided him with behavioral training and found him a perfect match with a retired police officer. Max now works as a search and rescue dog, saving lives in his new role.",
      adopter: "Mike Rodriguez",
      location: "Denver, CO",
      rating: 5,
      timeAgo: "4 months ago"
    },
    {
      id: 3,
      name: "Luna",
      breed: "Border Collie Mix",
      age: "2 years old",
      image: "🐕",
      story: "Luna was rescued from a hoarding situation with 20 other dogs. Despite her traumatic past, she showed incredible resilience. After months of rehabilitation, she was adopted by a family with children and has become the most loving and protective family member.",
      adopter: "Emily Chen",
      location: "Seattle, WA",
      rating: 5,
      timeAgo: "8 months ago"
    },
    {
      id: 4,
      name: "Rocky",
      breed: "Pit Bull Mix",
      age: "4 years old",
      image: "🐕",
      story: "Rocky was found as a stray with multiple injuries. Our veterinary team performed life-saving surgery, and our behavioral specialists worked with him for months. He was adopted by a couple who runs a dog training business, and now he helps train other rescue dogs.",
      adopter: "David & Lisa Park",
      location: "Miami, FL",
      rating: 5,
      timeAgo: "1 year ago"
    },
    {
      id: 5,
      name: "Coco",
      breed: "Chihuahua Mix",
      age: "6 years old",
      image: "🐕",
      story: "Coco was surrendered to our shelter when her elderly owner could no longer care for her. Despite being a senior dog, she had so much love to give. She was adopted by a college student who needed emotional support, and they've been inseparable ever since.",
      adopter: "Jessica Martinez",
      location: "Portland, OR",
      rating: 5,
      timeAgo: "3 months ago"
    },
    {
      id: 6,
      name: "Duke",
      breed: "Labrador Retriever",
      age: "1 year old",
      image: "🐕",
      story: "Duke was rescued from a puppy mill where he was kept in terrible conditions. Our team provided extensive medical care and socialization. He was adopted by a family with young children and has become the most gentle and patient playmate for the kids.",
      adopter: "The Thompson Family",
      location: "Chicago, IL",
      rating: 5,
      timeAgo: "5 months ago"
    }
  ]

  const stats = [
    { number: "15,000+", label: "Happy Endings Created" },
    { number: "98%", label: "Success Rate" },
    { number: "500+", label: "Partner Shelters" },
    { number: "24/7", label: "Support Available" }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-yellow-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200 hover:scale-105 transition-transform duration-200">
            <Heart className="h-4 w-4 mr-2" />
            Success Stories
          </Badge>
          
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Real Stories,
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Real Impact
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-200 max-w-3xl mx-auto mb-8">
            Every donation and purchase creates a ripple effect of love and hope. 
            See how your support transforms lives and creates beautiful new beginnings.
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center hover:scale-105 transition-transform duration-200">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <Card key={story.id} className="border-0 shadow-lg hover:shadow-xl dark:hover:shadow-white/10 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105 group">
              <CardContent className="p-6">
                {/* Story Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-6xl">{story.image}</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Dog Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors duration-200">
                    {story.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {story.breed} • {story.age}
                  </p>
                </div>

                {/* Quote */}
                <div className="relative mb-4">
                  <Quote className="h-6 w-6 text-orange-200 absolute -top-2 -left-2" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm italic pl-4">
                    "{story.story}"
                  </p>
                </div>

                {/* Adopter Info */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {story.adopter}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {story.location}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:scale-105 transition-transform duration-200">
                      {story.timeAgo}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Help Create More Happy Endings
              </h3>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Every donation and purchase directly supports rescue operations, medical care, 
                and finding loving homes for dogs in need. Be part of the next success story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/donate">
                  <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform duration-200">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 hover:scale-105 transition-all duration-200">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Shop for a Cause
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}