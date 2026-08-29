import { z } from 'zod'
// Installs the Serbian fallback for rules without their own message. Every
// message below still wins over it; the import is what keeps a rule that gains
// a constraint later from quietly printing English at a visitor.
import './zod-locale'

/**
 * Validation shared by the browser and the route handlers, so a payload can
 * never pass one and fail the other.
 *
 * Every constraint carries its own Serbian text, including the caps: these
 * messages are rendered verbatim under the field, so a rule without one puts
 * Zod's English default in front of the visitor.
 */

export const reportKinds = ['nestao', 'pronadjen', 'ugrozen'] as const
export type ReportKind = (typeof reportKinds)[number]

const phoneOrEmail = (value: string) =>
  /^[+0-9][0-9 ()/-]{5,19}$/.test(value) || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)

export const reportSchema = z.object({
  kind: z.enum(reportKinds, { error: 'Izaberi jednu od ponuđenih opcija.' }),
  location: z
    .string()
    .trim()
    .min(3, 'Upiši bar naselje ili ulicu.')
    .max(160, 'Skrati opis lokacije na 160 znakova.'),
  size: z
    .string()
    .trim()
    .min(1, 'Izaberi veličinu.')
    .max(20, 'Izaberi jednu od ponuđenih veličina.'),
  colors: z
    .array(z.string().max(20, 'Izaberi jednu od ponuđenih boja.'))
    .min(1, 'Izaberi bar jednu boju.')
    .max(6, 'Izaberi najviše šest boja.'),
  description: z
    .string()
    .trim()
    .min(10, 'Opiši psa u bar 10 znakova.')
    .max(1200, 'Skrati opis na 1200 znakova.'),
  contactName: z.string().trim().min(2, 'Upiši ime.').max(80, 'Skrati ime na 80 znakova.'),
  contactValue: z
    .string()
    .trim()
    .min(6, 'Ostavi telefon ili email.')
    .max(120, 'Skrati kontakt na 120 znakova.')
    .refine(phoneOrEmail, 'Upiši ispravan telefon ili email.'),
})

export type ReportDraft = z.infer<typeof reportSchema>

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Upiši ime.').max(80, 'Skrati ime na 80 znakova.'),
  email: z.string().trim().email('Upiši ispravan email.').max(120, 'Skrati email na 120 znakova.'),
  topic: z.enum(['opste', 'saradnja', 'sklonište', 'mediji', 'donacije'], {
    error: 'Izaberi jednu od ponuđenih tema.',
  }),
  message: z
    .string()
    .trim()
    .min(20, 'Napiši bar 20 znakova.')
    .max(4000, 'Skrati poruku na 4000 znakova.'),
  /**
   * Honeypot. Not length-constrained on purpose: a `max(0)` here turns a filled
   * field into a validation failure, and the route answers 422 naming the
   * field — which both tells a bot exactly what it tripped and dead-ends any
   * real visitor whose password manager autofilled it.
   */
  company: z.string().max(200).optional(),
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
