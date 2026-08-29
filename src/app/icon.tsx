import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

/**
 * App icon, rendered from the same mark the header draws.
 *
 * Generated rather than shipped as a file for the same reason the rest of the
 * site's imagery is: there are no raster assets in this repository. The paths
 * are <LogoMark>'s, scaled from its 32-unit viewBox, with the gradient stops
 * resolved to literals — Satori has no CSS custom properties to read.
 *
 * The manifest offers a "Prijavi psa" shortcut and `display: standalone`, so
 * the install prompt is a real invitation; without an icon it opened with a
 * blank tile.
 *
 * The mark is drawn at ~62% of the canvas because the manifest also declares
 * this asset `maskable`, and a masked icon can be cropped to the central 80%.
 * The toe opacities are raised over the on-page mark's: at 512px the original
 * values read as separate brown blobs rather than one gradient object.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#171514',
        }}
      >
        <svg width="320" height="320" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="m" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f6bd8a" />
              <stop offset="0.55" stopColor="#e8813a" />
              <stop offset="1" stopColor="#8b7cf0" />
            </linearGradient>
          </defs>
          <path
            d="M16 17.4c4.2 0 7.6 2.9 7.6 6.4 0 2.5-2 4.2-4.8 4.2-1.1 0-2-.2-2.8-.2s-1.7.2-2.8.2c-2.8 0-4.8-1.7-4.8-4.2 0-3.5 3.4-6.4 7.6-6.4Z"
            fill="url(#m)"
          />
          <ellipse
            cx="7.4"
            cy="14.6"
            rx="3.1"
            ry="3.9"
            transform="rotate(-18 7.4 14.6)"
            fill="url(#m)"
            opacity="0.9"
          />
          <ellipse
            cx="24.6"
            cy="14.6"
            rx="3.1"
            ry="3.9"
            transform="rotate(18 24.6 14.6)"
            fill="url(#m)"
            opacity="0.9"
          />
          <ellipse
            cx="12.2"
            cy="8.6"
            rx="2.9"
            ry="3.7"
            transform="rotate(-8 12.2 8.6)"
            fill="url(#m)"
            opacity="0.78"
          />
          <path
            d="M20.4 3.2c2.3 0 4.1 1.8 4.1 4.1 0 2.9-4.1 7-4.1 7s-4.1-4.1-4.1-7c0-2.3 1.8-4.1 4.1-4.1Z"
            fill="url(#m)"
          />
          <circle cx="20.4" cy="7.3" r="1.5" fill="#171514" />
        </svg>
      </div>
    ),
    size,
  )
}
