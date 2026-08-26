#!/usr/bin/env node
import { readFile } from 'node:fs/promises'

/**
 * Verifies the design system's contrast claims against WCAG 2.2.
 *
 * The token values are parsed out of `src/app/globals.css`, so this fails the
 * moment somebody nudges a colour without re-checking it. Colours are converted
 * OKLCH → OKLab → linear sRGB → relative luminance; alpha values are composited
 * over their stated backdrop first.
 *
 * Thresholds: 4.5:1 for body text (1.4.3), 3:1 for large text, UI components
 * and focus indicators (1.4.11, 2.4.13).
 */

const CSS = new URL('../src/app/globals.css', import.meta.url)

function oklchToLinearRgb(l, c, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = c * Math.cos(h)
  const b = c * Math.sin(h)

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.291485548 * b

  const L = l_ ** 3
  const M = m_ ** 3
  const S = s_ ** 3

  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ]
}

const clamp01 = (value) => Math.min(1, Math.max(0, value))

function relativeLuminance([r, g, b]) {
  return 0.2126 * clamp01(r) + 0.7152 * clamp01(g) + 0.0722 * clamp01(b)
}

/** Composites `fg` (with alpha) over `bg`, both linear-light RGB triples. */
function composite(fg, alpha, bg) {
  return fg.map((channel, index) => channel * alpha + bg[index] * (1 - alpha))
}

function contrast(a, b) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [light, dark] = la > lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

const OKLCH = /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*\)/

const css = await readFile(CSS, 'utf8')

/** Reads `--name: <value>` from a given block of the stylesheet. */
function block(selector) {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`Ne mogu da nađem blok: ${selector}`)
  const open = css.indexOf('{', start)
  const close = css.indexOf('\n}', open)
  return css.slice(open, close)
}

const primitives = block('@theme {')
const dark = block(':root {')
const light = block(':root.light {')

function resolve(name, scope, depth = 0) {
  if (depth > 8) throw new Error(`Kružna referenca: ${name}`)

  const direct = new RegExp(`--${name}:\\s*([^;]+);`).exec(scope)
  const source = direct ?? new RegExp(`--${name}:\\s*([^;]+);`).exec(primitives)
  if (!source) throw new Error(`Nepoznat token: --${name}`)

  const value = source[1].trim()
  const reference = /var\(--([a-z0-9-]+)\)/.exec(value)
  if (reference) return resolve(reference[1], scope, depth + 1)

  const match = OKLCH.exec(value)
  if (!match) throw new Error(`Token --${name} nije oklch(): ${value}`)

  return {
    rgb: oklchToLinearRgb(Number(match[1]), Number(match[2]), Number(match[3])),
    alpha: match[4] === undefined ? 1 : Number(match[4]),
  }
}

function ratio(fgName, bgName, scope) {
  const bg = resolve(bgName, scope)
  const fg = resolve(fgName, scope)
  const composited = fg.alpha === 1 ? fg.rgb : composite(fg.rgb, fg.alpha, bg.rgb)
  return contrast(composited, bg.rgb)
}

// [foreground, background, minimum ratio, what it is]
const CHECKS = [
  ['ink', 'canvas', 4.5, 'osnovni tekst na pozadini'],
  ['ink', 'elevated', 4.5, 'osnovni tekst na kartici'],
  ['ink-muted', 'canvas', 4.5, 'prigušen tekst na pozadini'],
  ['ink-muted', 'elevated', 4.5, 'prigušen tekst na kartici'],
  ['ink-subtle', 'canvas', 4.5, 'sitan tekst na pozadini'],
  ['ink-subtle', 'elevated', 4.5, 'sitan tekst na kartici'],
  ['ink-subtle', 'sunken', 4.5, 'sitan tekst na udubljenoj površini'],
  ['brand-ink', 'brand', 4.5, 'natpis na primarnom dugmetu'],
  ['brand-text', 'canvas', 4.5, 'brend tekst na pozadini'],
  ['brand-text', 'elevated', 4.5, 'brend tekst na kartici'],
  ['accent-text', 'elevated', 4.5, 'akcenat tekst na kartici'],
  ['positive', 'elevated', 4.5, 'pozitivan status'],
  ['critical', 'elevated', 4.5, 'kritičan status'],
  ['ring', 'canvas', 3, 'fokus prsten na pozadini'],
  ['ring', 'elevated', 3, 'fokus prsten na kartici'],
  ['brand', 'canvas', 3, 'brend kao UI element'],
  ['accent', 'elevated', 3, 'akcenat kao UI element'],
  ['line-interactive', 'sunken', 3, 'ivica polja za unos'],
]

let failed = 0
for (const [scopeName, scope] of [
  ['tamna', dark],
  ['svetla', light],
]) {
  console.log(`\n${scopeName} tema`)
  for (const [fg, bg, minimum, label] of CHECKS) {
    const value = ratio(fg, bg, scope)
    const ok = value >= minimum
    if (!ok) failed += 1
    console.log(
      `  ${ok ? 'OK  ' : 'PAD '} ${value.toFixed(2)}:1 (min ${minimum}:1)  --${fg} / --${bg}  — ${label}`,
    )
  }
}

if (failed > 0) {
  console.error(`\ncheck-contrast: ${failed} para ne prolazi WCAG.`)
  process.exit(1)
}
console.log('\ncheck-contrast: svi parovi prolaze.')
