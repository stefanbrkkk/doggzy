import type { Metadata, Viewport } from 'next'
import { Inter, Instrument_Serif, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { site } from '@/config/site'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Preloader, preloaderScript } from '@/components/layout/preloader'
import { CartDrawer } from '@/components/shop/cart-drawer'
import { FlyToCart } from '@/components/shop/fly-to-cart'
import { Cursor, ScrollProgress } from '@/components/motion'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  // latin-ext carries č ć š ž đ — without it the serif silently drops Serbian
  // diacritics mid-word.
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'nestao pas',
    'prijava psa',
    // Kept as a search term only — the visible copy says "udomljavanje",
    // because "usvajanje" is what you do with a child, not a dog.
    'udomljavanje pasa Srbija',
    'usvajanje pasa Srbija',
    'donacije za pse',
    'skloništa Srbija',
    'virtuelno starateljstvo',
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'sr_RS',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#151312' },
    { media: '(prefers-color-scheme: light)', color: '#fbfaf8' },
  ],
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sr-Latn-RS"
      // `dark` matches the default in <Providers>; next-themes rewrites it
      // before paint if the visitor has chosen otherwise.
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderScript }} />
        {/* With scripting off the curtain has nothing to lift it, and the CSS
            failsafe in globals.css would still leave it up for 5.5s. */}
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-canvas text-ink antialiased">
        <a
          href="#sadrzaj"
          className="sr-only z-[400] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-xl focus:bg-brand focus:px-5 focus:py-3 focus:font-medium focus:text-brand-ink"
        >
          Pređi na sadržaj
        </a>

        <Providers>
          <Preloader />
          <ScrollProgress />
          <Cursor />
          <SiteHeader />

          <main id="sadrzaj">{children}</main>

          <SiteFooter />
          <CartDrawer />
          <FlyToCart />
        </Providers>
      </body>
    </html>
  )
}
