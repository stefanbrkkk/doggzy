import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Doggzy Admin' },
  robots: { index: false, follow: false },
}

/**
 * The admin sits inside the root layout, so it inherits the theme, fonts and
 * providers. The public header and footer stay — an admin who wants to check
 * how a change looks on the live site is one click away.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[70svh]">{children}</div>
}
