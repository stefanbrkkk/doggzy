import { z } from 'zod'

// Base schemas for common content blocks
export const HeroSchema = z.object({
  badge: z.string().optional(),
  title: z.string(),
  titleHighlight: z.string().optional(),
  subtitle: z.string(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary')
  }).optional(),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['primary', 'secondary', 'outline']).default('secondary')
  }).optional(),
  trustIndicators: z.array(z.object({
    value: z.string(),
    label: z.string(),
    icon: z.string().optional()
  })).optional(),
  media: z.object({
    type: z.enum(['image', 'video']),
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    autoplay: z.boolean().default(false)
  }).optional()
})

export const StatsSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  stats: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
    change: z.string().optional(),
    changeType: z.enum(['positive', 'negative', 'neutral']).default('neutral')
  }))
})

export const FeatureSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  media: z.object({
    type: z.enum(['image', 'video']),
    src: z.string(),
    alt: z.string().optional()
  }).optional()
})

export const FeaturesSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  features: z.array(FeatureSchema)
})

export const CtaSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  primaryCta: z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary')
  }),
  secondaryCta: z.object({
    label: z.string(),
    href: z.string(),
    variant: z.enum(['primary', 'secondary', 'outline']).default('secondary')
  }).optional(),
  background: z.enum(['default', 'muted', 'accent']).default('default')
})

export const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string()
})

export const FaqSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z.array(FaqItemSchema)
})

export const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  ogType: z.string().default('website'),
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
  canonical: z.string().optional(),
  noindex: z.boolean().default(false),
  nofollow: z.boolean().default(false)
})

// Page-specific schemas
export const HomePageSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  impact: StatsSchema,
  successStories: z.object({
    title: z.string(),
    titleHighlight: z.string().optional(),
    subtitle: z.string(),
    stats: z.array(z.object({
      label: z.string(),
      value: z.string()
    })),
    cta: CtaSchema
  }),
  latestStory: z.object({
    title: z.string(),
    subtitle: z.string(),
    quote: z.string(),
    badges: z.array(z.string()),
    media: z.object({
      type: z.enum(['image', 'video']),
      src: z.string(),
      caption: z.string()
    }),
    primaryCta: z.object({
      label: z.string(),
      href: z.string()
    }),
    secondaryCta: z.object({
      label: z.string(),
      href: z.string()
    })
  })
})

export const AdoptPageSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  process: z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional()
    }))
  }),
  requirements: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(z.string())
  }),
  benefits: FeaturesSchema,
  cta: CtaSchema
})

export const FosterPageSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  whyFoster: z.object({
    title: z.string(),
    description: z.string(),
    benefits: z.array(z.string())
  }),
  responsibilities: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(z.string())
  }),
  support: z.object({
    title: z.string(),
    description: z.string(),
    items: z.array(z.string())
  }),
  benefits: FeaturesSchema,
  cta: CtaSchema
})

export const DonatePageSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  features: FeaturesSchema,
  impact: StatsSchema,
  urgentCta: CtaSchema
})

export const ShopPageSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  features: FeaturesSchema,
  categories: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    image: z.string()
  }))
})

export const AboutPageSchema = z.object({
  seo: SeoSchema,
  hero: HeroSchema,
  story: z.object({
    title: z.string(),
    paragraphs: z.array(z.string()),
    cta: z.object({
      primary: z.string(),
      secondary: z.string()
    })
  }),
  values: FeaturesSchema,
  team: z.object({
    title: z.string(),
    subtitle: z.string(),
    members: z.array(z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      image: z.string(),
      social: z.object({
        linkedin: z.string().optional(),
        twitter: z.string().optional()
      }).optional()
    }))
  }),
  journey: z.object({
    title: z.string(),
    subtitle: z.string(),
    milestones: z.array(z.object({
      year: z.string(),
      title: z.string(),
      description: z.string()
    }))
  }),
  cta: CtaSchema
})

export const LegalPageSchema = z.object({
  seo: SeoSchema,
  title: z.string(),
  lastUpdated: z.string(),
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    subsections: z.array(z.object({
      title: z.string(),
      content: z.string()
    })).optional()
  }))
})

// Type exports
export type Hero = z.infer<typeof HeroSchema>
export type Stats = z.infer<typeof StatsSchema>
export type Feature = z.infer<typeof FeatureSchema>
export type Features = z.infer<typeof FeaturesSchema>
export type Cta = z.infer<typeof CtaSchema>
export type Faq = z.infer<typeof FaqSchema>
export type Seo = z.infer<typeof SeoSchema>

export type HomePage = z.infer<typeof HomePageSchema>
export type AdoptPage = z.infer<typeof AdoptPageSchema>
export type FosterPage = z.infer<typeof FosterPageSchema>
export type DonatePage = z.infer<typeof DonatePageSchema>
export type ShopPage = z.infer<typeof ShopPageSchema>
export type AboutPage = z.infer<typeof AboutPageSchema>
export type LegalPage = z.infer<typeof LegalPageSchema>

// Content loader function
export async function loadContent<T>(
  path: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const content = await import(`@/content/${path}`)
    return schema.parse(content.default || content)
  } catch (error) {
    console.error(`Failed to load content from ${path}:`, error)
    throw new Error(`Content loading failed: ${path}`)
  }
}

// Convenience loaders for each page type
export const loadHomePage = () => loadContent('pages/home.json', HomePageSchema)
export const loadAdoptPage = () => loadContent('pages/adopt.json', AdoptPageSchema)
export const loadFosterPage = () => loadContent('pages/foster.json', FosterPageSchema)
export const loadDonatePage = () => loadContent('pages/donate.json', DonatePageSchema)
export const loadShopPage = () => loadContent('pages/shop.json', ShopPageSchema)
export const loadAboutPage = () => loadContent('pages/about.json', AboutPageSchema)
export const loadLegalPage = (page: 'terms' | 'privacy' | 'cookies') => 
  loadContent(`pages/${page}.json`, LegalPageSchema)