import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Foster a Dog | Temporary Care, Lifelong Impact | Doggzy',
  description: 'Foster a rescue dog and help them find their forever home. Provide temporary care while we find the perfect match. All supplies and medical care provided.',
  keywords: 'dog fostering, foster care, temporary dog care, animal rescue, dog rehabilitation',
  openGraph: {
    title: 'Foster a Dog | Temporary Care, Lifelong Impact | Doggzy',
    description: 'Foster a rescue dog and help them find their forever home. Provide temporary care while we find the perfect match.',
    url: 'https://doggzy.org/foster',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foster a Dog | Temporary Care, Lifelong Impact | Doggzy',
    description: 'Foster a rescue dog and help them find their forever home. Provide temporary care while we find the perfect match.',
    images: ['/og-image.jpg'],
  },
}

export default function FosterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
