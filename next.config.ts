import type { NextConfig } from 'next'

/**
 * Content Security Policy.
 *
 * Every asset this site uses is same-origin: fonts are self-hosted by
 * `next/font`, there is no analytics script, and there is no image CDN. That
 * lets the policy stay tight. Two allowances are unavoidable:
 *
 * - `'unsafe-inline'` for scripts, because the App Router streams the RSC
 *   payload through inline `<script>` tags. Removing it requires per-request
 *   nonces, which in turn forces every page to render dynamically.
 * - `'unsafe-inline'` for styles, which Next injects for critical CSS.
 *
 * `blob:` is in `img-src` for the photo the report flow previews locally before
 * upload; it never leaves the browser.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  {
    key: 'Permissions-Policy',
    // Geolocation stays enabled for self: the report flow offers "use my location".
    value:
      'camera=(self), microphone=(), geolocation=(self), payment=(), usb=(), interest-cohort=()',
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  compiler: {
    // Keep warn/error in production; they carry the only diagnostics we have.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        // Hashed build output is immutable by construction.
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
