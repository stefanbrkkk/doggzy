import { Resend } from 'resend'

/**
 * Outbound notification for form submissions.
 *
 * Sends through Resend when `RESEND_API_KEY` and `NOTIFY_TO` are both set. When
 * they are not — local development, preview deploys — it logs a structured line
 * on the server instead of pretending to have sent something. The caller's
 * success response is never contingent on delivery: a failed email must not
 * lose someone's report.
 */

export interface Notification {
  subject: string
  lines: string[]
  replyTo?: string
}

let client: Resend | null = null

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  if (!client) client = new Resend(key)
  return client
}

export async function deliverNotification(notification: Notification): Promise<boolean> {
  const to = process.env.NOTIFY_TO
  const from = process.env.NOTIFY_FROM ?? 'Doggzy <onboarding@resend.dev>'
  const resend = getClient()

  if (!resend || !to) {
    console.info('[notify:unconfigured]', notification.subject, notification.lines.join(' | '))
    return false
  }

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: notification.subject,
      text: notification.lines.join('\n'),
      ...(notification.replyTo ? { replyTo: notification.replyTo } : {}),
    })

    if (error) {
      console.error('[notify:failed]')
      return false
    }
    return true
  } catch {
    console.error('[notify:threw]')
    return false
  }
}
