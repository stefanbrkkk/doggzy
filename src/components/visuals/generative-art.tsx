import { cn } from '@/lib/utils'
import type { ArtShape } from '@/lib/art'

/**
 * Deterministic generative cover art.
 *
 * The catalogue ships without photography, so every product renders a piece of
 * SVG built from its own `art` descriptor: a two-stop palette plus one of eight
 * compositions. A hash of the product id seeds the placement, so a given
 * product always draws the exact same image — on the server, on the client, and
 * across reloads — without shipping a single raster asset.
 */

/** FNV-1a. Small, fast, and stable across runtimes. */
function hash(input: string): number {
  let value = 0x811c9dc5
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i)
    value = Math.imul(value, 0x01000193)
  }
  return value >>> 0
}

/** Deterministic 0..1 sequence seeded by the hash. */
function makeRandom(seed: number) {
  let state = seed || 1
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state / 0xffffffff
  }
}

export interface GenerativeArtProps {
  /** Stable identity: same seed, same picture. */
  seed: string
  shape: ArtShape
  from: string
  to: string
  /** Describes the image for assistive tech. */
  alt: string
  className?: string
  /** Adds the hover choreography. Turn off for static contexts like the cart. */
  interactive?: boolean
}

export function GenerativeArt({
  seed,
  shape,
  from,
  to,
  alt,
  className,
  interactive = false,
}: GenerativeArtProps) {
  const random = makeRandom(hash(seed))
  const gradientId = `art-${seed}`
  const glowId = `glow-${seed}`

  return (
    // Decorative by definition: it must never intercept a click meant for a
    // control layered over it. Events pass through to ancestors either way, so
    // a wrapping link still works.
    <div
      className={cn('pointer-events-none relative isolate overflow-hidden bg-sunken', className)}
    >
      <svg
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        className={cn(
          'h-full w-full',
          interactive && 'transition-transform duration-700 ease-out-expo group-hover:scale-[1.06]',
        )}
        role="img"
        aria-label={alt}
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="400"
            y2="400"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={from} />
            <stop offset="1" stopColor={to} />
          </linearGradient>
          <radialGradient id={glowId} cx="0.5" cy="0.4" r="0.7">
            <stop stopColor={from} stopOpacity="0.55" />
            <stop offset="1" stopColor={to} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="400" height="400" fill="var(--sunken)" />
        <rect width="400" height="400" fill={`url(#${glowId})`} />

        <g
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          // Both driven by theme tokens: the alphas and the ramp colours were
          // chosen against near-black, and over the light theme's near-white
          // ground the same strokes flatten into a pale wash.
          style={{ filter: 'var(--art-ink)' }}
        >
          {shape === 'orbit' ? <Orbit random={random} gradientId={gradientId} /> : null}
          {shape === 'waves' ? <Waves random={random} /> : null}
          {shape === 'grid' ? <Grid random={random} gradientId={gradientId} /> : null}
          {shape === 'bloom' ? <Bloom random={random} gradientId={gradientId} /> : null}
          {shape === 'pulse' ? <Pulse random={random} /> : null}
          {shape === 'ridge' ? <Ridge random={random} /> : null}
          {shape === 'prism' ? <Prism random={random} gradientId={gradientId} /> : null}
          {shape === 'trace' ? <Trace random={random} /> : null}
        </g>
      </svg>

      {/* Hairline inset keeps the art from bleeding into the card edge. */}
      <span
        aria-hidden="true"
        data-decor
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/8"
      />
    </div>
  )
}

type Rand = () => number

function Orbit({ random, gradientId }: { random: Rand; gradientId: string }) {
  const rings = Array.from({ length: 5 }, (_, i) => ({
    r: 52 + i * 32,
    rotate: random() * 60 - 30,
    dash: 6 + random() * 26,
  }))
  return (
    <>
      {rings.map((ring, i) => (
        <ellipse
          key={i}
          cx="200"
          cy="200"
          rx={ring.r}
          ry={ring.r * 0.62}
          strokeWidth={1.4}
          style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.28 + i * 0.11})` }}
          strokeDasharray={`${ring.dash} ${ring.dash * 0.8}`}
          transform={`rotate(${ring.rotate} 200 200)`}
        />
      ))}
      <circle cx="200" cy="200" r="26" fill={`url(#${gradientId})`} stroke="none" />
    </>
  )
}

function Waves({ random }: { random: Rand }) {
  const lines = Array.from({ length: 16 }, (_, i) => {
    const y = 40 + i * 20
    const amp = 14 + random() * 26
    return `M -20 ${y} C 80 ${y - amp}, 160 ${y + amp}, 240 ${y - amp * 0.6} S 380 ${y + amp}, 420 ${y}`
  })
  return (
    <>
      {lines.map((d, i) => (
        <path
          key={i}
          d={d}
          strokeWidth={1.5}
          style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.16 + (i % 5) * 0.13})` }}
        />
      ))}
    </>
  )
}

function Grid({ random, gradientId }: { random: Rand; gradientId: string }) {
  const cells = Array.from({ length: 36 }, (_, i) => ({
    x: 44 + (i % 6) * 54,
    y: 44 + Math.floor(i / 6) * 54,
    filled: random() > 0.68,
    size: 20 + random() * 16,
  }))
  return (
    <>
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x - cell.size / 2}
          y={cell.y - cell.size / 2}
          width={cell.size}
          height={cell.size}
          rx={5}
          strokeWidth={1.3}
          style={{ strokeOpacity: `calc(var(--art-alpha) * ${cell.filled ? 0 : 0.24})` }}
          fill={cell.filled ? `url(#${gradientId})` : 'none'}
          fillOpacity={cell.filled ? 0.85 : 0}
        />
      ))}
    </>
  )
}

function Bloom({ random, gradientId }: { random: Rand; gradientId: string }) {
  // Count, phase and petal width all vary with the seed. With those fixed,
  // every bloom in a grid renders as the same flower in different colours.
  const count = 7 + Math.floor(random() * 10)
  const phase = random() * 360
  const width = 12 + random() * 16
  const inner = 10 + random() * 16

  const petals = Array.from({ length: count }, (_, i) => ({
    rotate: phase + (360 / count) * i,
    length: 78 + random() * 76,
  }))

  return (
    <>
      {petals.map((petal, i) => (
        <ellipse
          key={i}
          cx="200"
          cy={200 - petal.length / 2}
          rx={width}
          ry={petal.length / 2}
          strokeWidth={1.3}
          style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.3})` }}
          fill={`url(#${gradientId})`}
          fillOpacity={0.1}
          transform={`rotate(${petal.rotate} 200 200)`}
        />
      ))}
      <circle cx="200" cy="200" r={inner} fill={`url(#${gradientId})`} stroke="none" />
    </>
  )
}

function Pulse({ random }: { random: Rand }) {
  const points = Array.from({ length: 46 }, (_, i) => {
    const x = i * 9
    const spike = random() > 0.86
    const y = spike ? 200 - (60 + random() * 90) : 200 + (random() - 0.5) * 22
    return `${x},${y}`
  }).join(' ')
  return (
    <>
      <polyline
        points={points}
        strokeWidth={2.2}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.95})` }}
        strokeLinejoin="round"
      />
      <polyline
        points={points}
        strokeWidth={9}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.12})` }}
        strokeLinejoin="round"
      />
      <line
        x1="0"
        y1="200"
        x2="400"
        y2="200"
        strokeWidth={1}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.14})` }}
      />
    </>
  )
}

function Ridge({ random }: { random: Rand }) {
  const layers = Array.from({ length: 9 }, (_, i) => {
    const base = 130 + i * 26
    const peaks = Array.from({ length: 9 }, (_, p) => `${p * 50},${base - random() * 46}`).join(
      ' L ',
    )
    return `M -20,420 L ${peaks} L 420,420 Z`
  })
  return (
    <>
      {layers.map((d, i) => (
        <path
          key={i}
          d={d}
          strokeWidth={1.4}
          style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.2 + i * 0.07})` }}
        />
      ))}
    </>
  )
}

function Prism({ random, gradientId }: { random: Rand; gradientId: string }) {
  const shards = Array.from({ length: 7 }, (_, i) => {
    const x = 40 + i * 48
    const skew = random() * 40 - 20
    return `M ${x},${340 + skew} L ${x + 30},${60 + random() * 80} L ${x + 62},${340 - skew} Z`
  })
  return (
    <>
      {shards.map((d, i) => (
        <path
          key={i}
          d={d}
          strokeWidth={1.3}
          style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.3})` }}
          fill={`url(#${gradientId})`}
          fillOpacity={i % 2 === 0 ? 0.18 : 0.06}
        />
      ))}
    </>
  )
}

function Trace({ random }: { random: Rand }) {
  /** One wandering route; the seed decides where it turns. */
  const route = (startX: number, startY: number, steps: number) => {
    let x = startX
    let y = startY
    const segments: string[] = [`M ${x} ${y}`]
    for (let i = 0; i < steps; i += 1) {
      const nx = x + 20 + random() * 46
      const ny = y - 18 - random() * 40
      segments.push(`Q ${x + 26} ${ny - 16}, ${nx} ${ny}`)
      x = nx
      y = ny
    }
    return { path: segments.join(' '), endX: x, endY: y }
  }

  const primary = route(28, 356, 9)
  const secondary = route(-10, 300, 8)

  return (
    <>
      {/* Faint survey grid, so a single route does not read as an empty frame. */}
      <g strokeWidth={1} style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.09})` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`h${i}`} x1="-10" y1={i * 52 + 18} x2="410" y2={i * 52 + 18} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={`v${i}`} x1={i * 52 + 18} y1="-10" x2={i * 52 + 18} y2="410" />
        ))}
      </g>

      <path
        d={secondary.path}
        strokeWidth={1.4}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.28})` }}
        strokeDasharray="7 8"
      />
      <path
        d={primary.path}
        strokeWidth={14}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.12})` }}
      />
      <path
        d={primary.path}
        strokeWidth={2.2}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.95})` }}
      />

      <circle
        cx="28"
        cy="356"
        r="4.5"
        strokeWidth={2}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.6})` }}
      />
      <circle
        cx={primary.endX}
        cy={primary.endY}
        r="8"
        strokeWidth={2.2}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.95})` }}
      />
      <circle
        cx={primary.endX}
        cy={primary.endY}
        r="17"
        strokeWidth={1.2}
        style={{ strokeOpacity: `calc(var(--art-alpha) * ${0.35})` }}
      />
    </>
  )
}
