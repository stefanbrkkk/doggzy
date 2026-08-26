import { z } from 'zod'

/**
 * Validation shared by the browser and the route handlers, so a payload can
 * never pass one and fail the other.
 */

export const reportKinds = ['nestao', 'pronadjen', 'ugrozen'] as const
export type ReportKind = (typeof reportKinds)[number]

const phoneOrEmail = (value: string) =>
  /^[+0-9][0-9 ()/-]{5,19}$/.test(value) || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)

export const reportSchema = z.object({
  kind: z.enum(reportKinds),
  location: z.string().trim().min(3, 'Upiši bar naselje ili ulicu.').max(160),
  size: z.string().trim().min(1, 'Izaberi veličinu.').max(20),
  colors: z.array(z.string().max(20)).min(1, 'Izaberi bar jednu boju.').max(6),
  description: z.string().trim().min(10, 'Opiši psa u bar 10 karaktera.').max(1200),
  contactName: z.string().trim().min(2, 'Upiši ime.').max(80),
  contactValue: z
    .string()
    .trim()
    .min(6, 'Ostavi telefon ili email.')
    .max(120)
    .refine(phoneOrEmail, 'Upiši ispravan telefon ili email.'),
})

export type ReportDraft = z.infer<typeof reportSchema>

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Upiši ime.').max(80),
  email: z.string().trim().email('Upiši ispravan email.').max(120),
  topic: z.enum(['opste', 'saradnja', 'sklonište', 'mediji', 'donacije']),
  message: z.string().trim().min(20, 'Napiši bar 20 karaktera.').max(4000),
  /** Honeypot: real people never fill this in. */
  company: z.string().max(0).optional(),
})

export type ContactDraft = z.infer<typeof contactSchema>

/**
 * Case references are human-quotable over the phone: DG-YYMM-XXXX, using an
 * alphabet without the characters people mishear (I/1, O/0).
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function createReference(date = new Date()): string {
  const stamp = `${date.getFullYear().toString().slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}`
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const suffix = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join('')
  return `DG-${stamp}-${suffix}`
}
