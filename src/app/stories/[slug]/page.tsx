import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogStoryAdapter } from '@/lib/storage/file-adapter'
import { AnimatedPage } from '@/components/animated-page'
import { MotionContainer, MotionItem } from '@/components/shared/motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, Heart, Share2, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface StoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await blogStoryAdapter.getBySlug(slug)

  if (!story || story.status !== 'published') {
    return {
      title: 'Story Not Found - Doggzy',
    }
  }

  const seoTitle = story.seo?.seoTitle || story.title
  const seoDescription = story.seo?.seoDescription || story.summary
  const ogImage = story.seo?.ogImage || story.heroImage?.src || '/og-image.jpg'

  return {
    title: `${seoTitle} - Doggzy`,
    description: seoDescription,
    keywords: story.tags,
    authors: story.author ? [{ name: story.author.name }] : undefined,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt,
      authors: story.author ? [story.author.name] : undefined,
      tags: story.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: story.heroImage?.alt || story.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `/stories/${story.slug}`,
    },
    robots: {
      index: !story.seo?.noindex,
      follow: !story.seo?.nofollow,
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const story = await blogStoryAdapter.getBySlug(slug)

  if (!story || story.status !== 'published') {
    notFound()
  }

  // Get related stories
  const relatedStoriesResult = await blogStoryAdapter.getAll(
    { 
      status: 'published',
      tags: story.tags.slice(0, 2), // Use first 2 tags for relation
      limit: 3
    },
    { field: 'publishedAt', direction: 'desc' }
  )
  
  const relatedStories = relatedStoriesResult.items.filter(s => s.id !== story.id).slice(0, 3)

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {story.heroImage && (
            <div className="relative h-96 lg:h-[500px]">
              <Image
                src={story.heroImage.src}
                alt={story.heroImage.alt}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Back button */}
              <div className="absolute top-8 left-8 z-10">
                <Link href="/stories">
                  <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Stories
                  </Button>
                </Link>
              </div>

              {/* Story metadata overlay */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <MotionContainer>
                  <MotionItem>
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-white/90">
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
                      {story.featured && (
                        <Badge className="bg-orange-500 hover:bg-orange-600">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </MotionItem>
                  
                  <MotionItem>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-4xl">
                      {story.title}
                    </h1>
                  </MotionItem>
                  
                  <MotionItem>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl">
                      {story.summary}
                    </p>
                  </MotionItem>
                </MotionContainer>
              </div>
            </div>
          )}

          {!story.heroImage && (
            <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white py-24 lg:py-32">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <MotionContainer>
                  <MotionItem>
                    <Link href="/stories">
                      <Button variant="secondary" size="sm" className="mb-8 bg-white/20 hover:bg-white/30 text-white border-white/30">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Stories
                      </Button>
                    </Link>
                  </MotionItem>
                  
                  <MotionItem>
                    <div className="flex flex-wrap items-center gap-4 mb-6 text-white/90">
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
                      {story.featured && (
                        <Badge className="bg-white/20 hover:bg-white/30 border-white/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </MotionItem>
                  
                  <MotionItem>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl">
                      {story.title}
                    </h1>
                  </MotionItem>
                  
                  <MotionItem>
                    <p className="text-xl sm:text-2xl text-white/90 max-w-3xl">
                      {story.summary}
                    </p>
                  </MotionItem>
                </MotionContainer>
              </div>
            </div>
          )}
        </section>

        {/* Story Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <MotionContainer>
                {/* Author and sharing */}
                <MotionItem>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 pb-8 border-b border-gray-200">
                    {story.author && (
                      <div className="flex items-center gap-3">
                        {story.author.avatar && (
                          <Image
                            src={story.author.avatar}
                            alt={story.author.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        )}
                        {!story.author.avatar && (
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{story.author.name}</p>
                          {story.author.bio && (
                            <p className="text-sm text-gray-600">{story.author.bio}</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </MotionItem>

                {/* Tags */}
                {story.tags.length > 0 && (
                  <MotionItem>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {story.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </MotionItem>
                )}

                {/* Story content */}
                <MotionItem>
                  <div 
                    className="prose prose-lg prose-gray max-w-none
                      prose-headings:text-gray-900 prose-headings:font-bold
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-a:text-orange-600 hover:prose-a:text-orange-700
                      prose-strong:text-gray-900
                      prose-blockquote:border-l-orange-500 prose-blockquote:text-gray-600
                      prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ 
                      __html: story.content.replace(/\n/g, '<br>') 
                    }} 
                  />
                </MotionItem>

                {/* Gallery */}
                {story.gallery && story.gallery.length > 0 && (
                  <MotionItem>
                    <div className="mt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {story.gallery.map((image) => (
                          <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden shadow-lg">
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                            {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <p className="text-white text-sm">{image.caption}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </MotionItem>
                )}

                {/* Call to action */}
                <MotionItem>
                  <div className="mt-16 p-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl text-white text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">
                      Help Create More Stories Like This
                    </h3>
                    <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                      Every donation helps rescue more dogs and creates more happy endings. Your support makes these transformations possible.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/donate">
                        <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                          <Heart className="h-5 w-5 mr-2" />
                          Donate Now
                        </Button>
                      </Link>
                      <Link href="/adopt">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                          Adopt a Dog
                        </Button>
                      </Link>
                    </div>
                  </div>
                </MotionItem>
              </MotionContainer>
            </div>
          </div>
        </section>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <section className="py-16 bg-white/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <MotionContainer>
                <MotionItem>
                  <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    More Stories
                  </h2>
                </MotionItem>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {relatedStories.map((relatedStory) => (
                    <MotionItem key={relatedStory.id}>
                      <Link href={`/stories/${relatedStory.slug}`} className="group block">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                          {relatedStory.heroImage && (
                            <div className="relative h-48">
                              <Image
                                src={relatedStory.heroImage.src}
                                alt={relatedStory.heroImage.alt}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          
                          <div className="p-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(relatedStory.publishedAt!).toLocaleDateString()}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors mb-3 line-clamp-2">
                              {relatedStory.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {relatedStory.summary}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </MotionItem>
                  ))}
                </div>

                <MotionItem>
                  <div className="text-center mt-12">
                    <Link href="/stories">
                      <Button variant="outline" size="lg">
                        View All Stories
                      </Button>
                    </Link>
                  </div>
                </MotionItem>
              </MotionContainer>
            </div>
          </section>
        )}
      </div>
    </AnimatedPage>
  )
}