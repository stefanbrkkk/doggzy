import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adopt a Dog | Find Your Perfect Companion | Doggzy',
  description: 'Adopt a rescue dog and change two lives forever. Browse available dogs, learn about our adoption process, and find your perfect companion. Every adoption saves a life.',
  keywords: 'dog adoption, rescue dogs, pet adoption, adopt a dog, animal rescue, dog shelter',
  openGraph: {
    title: 'Adopt a Dog | Find Your Perfect Companion | Doggzy',
    description: 'Adopt a rescue dog and change two lives forever. Browse available dogs and find your perfect companion.',
    url: 'https://doggzy.org/adopt',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adopt a Dog | Find Your Perfect Companion | Doggzy',
    description: 'Adopt a rescue dog and change two lives forever. Browse available dogs and find your perfect companion.',
    images: ['/og-image.jpg'],
  },
}

export default function AdoptLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}