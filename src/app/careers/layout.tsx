import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers | Join Our Mission to Save Dogs Worldwide | Doggzy',
  description: 'Join the Doggzy team and help us rescue dogs globally. Remote-first culture, mission-driven work, and opportunities to make a real difference in animal welfare.',
  keywords: 'dog rescue jobs, animal welfare careers, remote work, charity jobs, mission-driven careers',
  openGraph: {
    title: 'Careers | Join Our Mission to Save Dogs Worldwide | Doggzy',
    description: 'Join the Doggzy team and help us rescue dogs globally. Remote-first culture and mission-driven work.',
    url: 'https://doggzy.org/careers',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Join Our Mission to Save Dogs Worldwide | Doggzy',
    description: 'Join the Doggzy team and help us rescue dogs globally. Remote-first culture and mission-driven work.',
    images: ['/og-image.jpg'],
  },
}

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
