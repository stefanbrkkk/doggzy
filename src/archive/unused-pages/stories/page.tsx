import { Metadata } from 'next'
import { blogStoryAdapter } from '@/lib/storage/file-adapter'
import { AnimatedPage } from '@/components/animated-page'
import { MotionContainer, MotionItem } from '@/components/shared/motion'
import { UnderglowCard } from '@/components/shared/underglow-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowRight, FileText, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Success Stories - Doggzy',
  description: 'Read heartwarming stories of rescued dogs finding their forever homes. Every story shows the impact of your support and donations.',
  keywords: ['dog rescue stories', 'success stories', 'adopted dogs', 'rescue testimonials', 'happy endings'],
  openGraph: {
    title: 'Success Stories - Every Dog Deserves a Happy Ending',
    description: 'Read heartwarming stories of rescued dogs finding their forever homes.',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Success Stories - Every Dog Deserves a Happy Ending',
    description: 'Read heartwarming stories of rescued dogs finding their forever homes.',
    images: ['/og-image.jpg'],
  },
}

export default async function StoriesPage() {
  // Get published stories
  const storiesResult = await blogStoryAdapter.getAll(
    { status: 'published', limit: 50 },
    { field: 'publishedAt', direction: 'desc' }
  )

  const stories = storiesResult.items
  const featuredStories = stories.filter(story => story.featured)
  const regularStories = stories.filter(story => !story.featured)

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
            <MotionContainer>
              <div className="max-w-4xl mx-auto text-center">
                <MotionItem>
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Heart className="h-12 w-12 text-white" />
                    </div>
                  </div>
                </MotionItem>
                
                <MotionItem>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                    Success Stories
                  </h1>
                </MotionItem>
                
                <MotionItem>
                  <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                    Every rescue has a story. Every story has a happy ending. Read about the incredible journeys of dogs who found their forever homes.
                  </p>
                </MotionItem>
                
                <MotionItem>
                  <div className="flex flex-wrap justify-center gap-4 text-white/80">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>{stories.length} Stories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      <span>{featuredStories.length} Featured</span>
                    </div>
                  </div>
                </MotionItem>
              </div>
            </MotionContainer>
          </div>
        </section>

        {/* Featured Stories */}
        {featuredStories.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <MotionContainer>
                <MotionItem>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                      Featured Stories
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Highlighted stories that showcase the incredible impact of rescue and adoption
                    </p>
                  </div>
                </MotionItem>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  {featuredStories.slice(0, 4).map((story) => (
                    <MotionItem key={story.id}>
                      <UnderglowCard>
                        <div className="group">
                          {story.heroImage && (
                            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-6">
                              <Image
                                src={story.heroImage.src}
                                alt={story.heroImage.alt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                                  Featured
                                </Badge>
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(story.publishedAt!).toLocaleDateString()}</span>
                              </div>
                              {story.readingTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{story.readingTime} min read</span>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                              {story.title}
                            </h3>
                            
                            <p className="text-gray-600 leading-relaxed">
                              {story.summary}
                            </p>
                            
                            {story.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {story.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            
                            <Link href={`/stories/${story.slug}`}>
                              <Button variant="outline" className="group/btn mt-4">
                                Read Story
                                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </UnderglowCard>
                    </MotionItem>
                  ))}
                </div>
              </MotionContainer>
            </div>
          </section>
        )}

        {/* All Stories */}
        {regularStories.length > 0 && (
          <section className="py-16 lg:py-24 bg-white/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <MotionContainer>
                <MotionItem>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                      All Stories
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Every rescue story is special and deserves to be told
                    </p>
                  </div>
                </MotionItem>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularStories.map((story) => (
                    <MotionItem key={story.id}>
                      <UnderglowCard>
                        <div className="group h-full flex flex-col">
                          {story.heroImage && (
                            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                              <Image
                                src={story.heroImage.src}
                                alt={story.heroImage.alt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(story.publishedAt!).toLocaleDateString()}</span>
                              </div>
                              {story.readingTime && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{story.readingTime}m</span>
                                </div>
                              )}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                              {story.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              {story.summary}
                            </p>
                            
                            {story.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {story.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-4 mt-auto">
                            <Link href={`/stories/${story.slug}`}>
                              <Button variant="outline" size="sm" className="w-full group/btn">
                                Read Story
                                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </UnderglowCard>
                    </MotionItem>
                  ))}
                </div>
              </MotionContainer>
            </div>
          </section>
        )}

        {/* Empty State */}
        {stories.length === 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Stories Yet
                </h2>
                <p className="text-gray-600 mb-8">
                  We&apos;re working on collecting and sharing amazing rescue stories. Check back soon to read about incredible transformations and happy endings.
                </p>
                <Link href="/adopt">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Help Create Stories
                    <Heart className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </AnimatedPage>
  )
}
