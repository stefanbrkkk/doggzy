import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Always `sr-Latn-RS`, never plain `sr-RS`.
 *
 * Serbian's default script in CLDR is Cyrillic, so plain `sr-RS` renders month
 * names in Cyrillic and drops them into an otherwise Latin page. Numbers happen
 * to be identical across the two scripts, but the locale is pinned for those
 * too so no future format string can reintroduce the mix.
 */
const LOCALE = 'sr-Latn-RS'

const RSD = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
})

const DECIMAL = new Intl.NumberFormat(LOCALE)

/** Prices are stored as whole dinars — the smallest unit anyone pays in RSD. */
export function formatRsd(amount: number): string {
  return RSD.format(amount)
}

export function formatNumber(value: number): string {
  return DECIMAL.format(value)
}

export function formatDate(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Maps a value from one range to another, clamped to the output range. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin
  const t = (value - inMin) / (inMax - inMin)
  return clamp(outMin + t * (outMax - outMin), Math.min(outMin, outMax), Math.max(outMin, outMax))
}

const DIACRITICS: Record<string, string> = {
  č: 'c',
  ć: 'c',
  đ: 'd',
  š: 's',
  ž: 'z',
  Č: 'c',
  Ć: 'c',
  Đ: 'd',
  Š: 's',
  Ž: 'z',
}

/** Slugifies Serbian Latin text, transliterating diacritics rather than dropping them. */
export function slugify(input: string): string {
  return input
    .replace(/[čćđšžČĆĐŠŽ]/g, (char) => DIACRITICS[char] ?? char)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Serbian plural rules: 1, 21, 31… take `one`; 2–4, 22–24… take `few`;
 * everything else takes `many`.
 */
export function plural(count: number, one: string, few: string, many: string): string {
  const abs = Math.abs(count) % 100
  const last = abs % 10
  if (abs > 10 && abs < 20) return many
  if (last === 1) return one
  if (last >= 2 && last <= 4) return few
  return many
}
