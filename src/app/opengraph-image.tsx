import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { site } from '@/config/site'

export const runtime = 'nodejs'
export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Social card, rendered rather than shipped as a file.
 *
 * The font is read from the repository instead of fetched at request time:
 * Satori's bundled fallback does not carry the Serbian diacritics, and a
 * network fetch inside image generation is a failure the crawler sees as a
 * broken card.
 */
export default async function OpengraphImage() {
  const font = await readFile(join(process.cwd(), 'src/assets/space-grotesk-600.ttf'))

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#171514',
          color: '#f7f4f1',
          fontFamily: 'Space Grotesk',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(255,141,42,0.42) 0%, rgba(23,21,20,0) 68%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -280,
            left: -180,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(150,86,240,0.28) 0%, rgba(23,21,20,0) 70%)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #ffb066, #ff8d2a 45%, #9656f0)',
              display: 'flex',
            }}
          />
          <div style={{ fontSize: 34, letterSpacing: -0.5 }}>{site.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ fontSize: 92, lineHeight: 1.02, letterSpacing: -3.5, display: 'flex' }}>
            Svaki dinar ima ime.
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              color: '#b9b2ab',
              maxWidth: 880,
              display: 'flex',
            }}
          >
            Prijavi nestalog psa, doniraj i proveri gde je novac otišao.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, fontSize: 24, color: '#8f8880' }}>
          <div style={{ display: 'flex' }}>doggzy.rs</div>
          <div style={{ display: 'flex' }}>Beograd · Novi Sad · Niš · Kragujevac · Subotica</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Space Grotesk', data: font, style: 'normal', weight: 600 }],
    },
  )
}
