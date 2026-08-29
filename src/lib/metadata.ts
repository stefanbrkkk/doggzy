import type { Metadata } from 'next'
import { site } from '@/config/site'

export interface PageMetaInput {
  title: string
  description: string
  /** Path this page canonicalises to, e.g. `/psi`. */
  path: string
  /** `article` for a dog, product or story page; `website` otherwise. */
  type?: 'website' | 'article'
  /** ISO date, for `article` pages that have one. */
  publishedTime?: string
  robots?: Metadata['robots']
}

/**
 * Per-page metadata, including the social card.
 *
 * Exists because Next 15 REPLACES an inherited `openGraph` object rather than
 * merging it. A page that set only `title` and `description` therefore
 * inherited the root layout's card whole — same text and, worse, `og:url`
 * pointing at the site root, so a share of /prijava resolved and deduped to the
 * homepage. A page that set a partial `openGraph` lost the other way: the
 * inherited image went with it, and all 21 detail pages — the ones that exist
 * to be shared — shipped cards with no image at all.
 *
 * `images` is named explicitly rather than left to the file convention for the
 * same reason: `app/opengraph-image.tsx` only attaches to metadata this route
 * did not otherwise define.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  robots,
}: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(robots ? { robots } : {}),
    openGraph: {
      ...(type === 'article'
        ? { type: 'article' as const, ...(publishedTime ? { publishedTime } : {}) }
        : { type: 'website' as const }),
      locale: 'sr_RS',
      siteName: site.name,
      url: path,
      title,
      description,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }
}
