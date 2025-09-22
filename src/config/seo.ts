export interface SeoConfig {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
}

export const defaultSeo: SeoConfig = {
  title: 'Doggzy - Every Dog Deserves a Happy Ending',
  description: 'Join our global movement to rescue, rehabilitate, and rehome dogs in need. Every donation and purchase directly saves lives and creates miracles.',
  keywords: ['dog rescue', 'animal charity', 'pet adoption', 'dog donation', 'animal welfare', 'rescue dogs'],
  ogImage: '/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}

export const seoPages: Record<string, SeoConfig> = {
  '/': {
    title: 'Doggzy - Every Dog Deserves a Happy Ending',
    description: 'Join our global movement to rescue, rehabilitate, and rehome dogs in need. Every donation and purchase directly saves lives and creates miracles.',
    keywords: ['dog rescue', 'animal charity', 'pet adoption', 'dog donation', 'animal welfare'],
    ogImage: '/og-image.jpg'
  },
  '/adopt': {
    title: 'Adopt a Dog - Find Your Best Friend | Doggzy',
    description: 'Adoption changes two lives: yours and theirs. Learn about our adoption process and find available dogs ready for their forever homes.',
    keywords: ['dog adoption', 'adopt a dog', 'rescue dogs', 'pet adoption process', 'find a dog'],
    ogImage: '/og-image.jpg'
  },
  '/foster': {
    title: 'Foster a Dog - Provide Temporary Love | Doggzy',
    description: 'Fostering creates space for more rescues. Learn how you can help by opening your home temporarily to dogs in need.',
    keywords: ['dog fostering', 'foster a dog', 'temporary care', 'rescue fostering', 'dog rehabilitation'],
    ogImage: '/og-image.jpg'
  },
  '/donate': {
    title: 'Donate to Save Dogs - Make a Difference Today | Doggzy',
    description: 'Every dollar you donate goes directly to rescuing, rehabilitating, and rehoming dogs in need. Join thousands making miracles happen.',
    keywords: ['dog donation', 'animal charity donation', 'rescue donation', 'help dogs', 'save dogs'],
    ogImage: '/og-image.jpg'
  },
  '/shop': {
    title: 'Shop to Save Lives - 100% Profits Go to Rescue Dogs | Doggzy',
    description: 'Every purchase directly supports our rescue operations. From custom portraits to eco-friendly accessories, find everything your dog needs.',
    keywords: ['dog products', 'pet accessories', 'charity shop', 'eco-friendly pet products', 'custom dog portraits'],
    ogImage: '/og-image.jpg'
  },
  '/sponsor': {
    title: 'Sponsor a Rescue Dog - Change a Life | Doggzy',
    description: 'Every dog deserves a second chance. Sponsor a rescue dog and follow their journey from rescue to recovery to their forever home.',
    keywords: ['sponsor a dog', 'dog sponsorship', 'support rescue dogs', 'monthly dog support'],
    ogImage: '/og-image.jpg'
  },
  '/impact': {
    title: 'Our Impact - See the Difference We Make | Doggzy',
    description: 'Every donation, every purchase, every action creates a ripple effect of positive change. See how our community transforms lives worldwide.',
    keywords: ['dog rescue impact', 'charity results', 'rescue statistics', 'animal welfare impact'],
    ogImage: '/og-image.jpg'
  },
  '/partners': {
    title: 'Global Partner Network - Trusted Rescue Organizations | Doggzy',
    description: 'Join our network of verified rescue organizations and shelters working together to save dogs and create happy endings worldwide.',
    keywords: ['rescue partners', 'shelter network', 'global dog rescue', 'verified shelters'],
    ogImage: '/og-image.jpg'
  },
  '/about': {
    title: 'About Doggzy - Our Mission to Save Dogs Worldwide',
    description: 'We\'re a global network of passionate dog lovers, rescue organizations, and volunteers working together to save lives and create happy endings.',
    keywords: ['about doggzy', 'dog rescue mission', 'animal charity', 'rescue organization', 'dog welfare'],
    ogImage: '/og-image.jpg'
  },
  '/careers': {
    title: 'Careers - Join Our Mission to Save Dogs | Doggzy',
    description: 'We\'re looking for passionate people to help us rescue, rehabilitate, and rehome dogs worldwide. Join our mission-driven team.',
    keywords: ['dog rescue jobs', 'animal charity careers', 'nonprofit jobs', 'remote animal welfare jobs'],
    ogImage: '/og-image.jpg'
  },
  '/contact': {
    title: 'Contact Us - Get in Touch | Doggzy',
    description: 'Have questions about adoption, fostering, or our mission? Get in touch with our team and learn how you can help save dogs.',
    keywords: ['contact doggzy', 'dog rescue contact', 'adoption questions', 'volunteer inquiry'],
    ogImage: '/og-image.jpg'
  },
  '/report': {
    title: 'Report Animal Abuse - See Something, Say Something | Doggzy',
    description: 'Report animal abuse, neglect, or unsafe conditions. We\'ll guide you on next steps and alert appropriate organizations.',
    keywords: ['report animal abuse', 'animal neglect reporting', 'dog abuse report', 'animal cruelty'],
    ogImage: '/og-image.jpg'
  },
  '/terms': {
    title: 'Terms of Service - Doggzy',
    description: 'Terms of service and conditions for using the Doggzy platform and services.',
    noindex: false
  },
  '/privacy': {
    title: 'Privacy Policy - Doggzy',
    description: 'How we collect, use, and protect your personal information when you use Doggzy services.',
    noindex: false
  },
  '/cookies': {
    title: 'Cookie Policy - Doggzy',
    description: 'Information about how we use cookies and similar technologies on our website.',
    noindex: false
  },
  '/accessibility': {
    title: 'Accessibility Statement - Doggzy',
    description: 'Our commitment to making our website accessible to everyone, including people with disabilities.',
    noindex: false
  },
  '/refunds': {
    title: 'Refund Policy - Doggzy',
    description: 'Information about our refund and return policies for donations and purchases.',
    noindex: false
  }
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Doggzy',
  description: 'Global dog rescue charity platform connecting shelters, volunteers, and donors worldwide',
  url: 'https://doggzy.org',
  logo: 'https://doggzy.org/logo.png',
  foundingDate: '2019',
  founder: {
    '@type': 'Person',
    name: 'Sarah Johnson'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US'
  },
  sameAs: [
    'https://facebook.com/doggzy',
    'https://instagram.com/doggzy',
    'https://twitter.com/doggzy',
    'https://linkedin.com/company/doggzy'
  ]
}

export function getSeoForPage(pathname: string): SeoConfig {
  return seoPages[pathname] || defaultSeo
}