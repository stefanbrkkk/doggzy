export interface NavigationItem {
  label: string
  href: string
  external?: boolean
  badge?: string
  children?: NavigationItem[]
}

export interface SocialLink {
  platform: string
  href: string
  icon: string
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Adopt',
    href: '/adopt'
  },
  {
    label: 'Foster',
    href: '/foster'
  },
  {
    label: 'Donate',
    href: '/donate'
  },
  {
    label: 'Shop',
    href: '/shop'
  },
  {
    label: 'More',
    href: '#',
    children: [
      {
        label: 'Sponsor a Pet',
        href: '/sponsor'
      },
      {
        label: 'Our Impact',
        href: '/impact'
      },
      {
        label: 'Partners',
        href: '/partners'
      },
      {
        label: 'About',
        href: '/about'
      },
      {
        label: 'Careers',
        href: '/careers'
      },
      {
        label: 'Contact',
        href: '/contact'
      }
    ]
  }
]

export const mobileNavigation: NavigationItem[] = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Adopt',
    href: '/adopt'
  },
  {
    label: 'Foster',
    href: '/foster'
  },
  {
    label: 'Donate',
    href: '/donate'
  },
  {
    label: 'Shop',
    href: '/shop'
  },
  {
    label: 'Sponsor a Pet',
    href: '/sponsor'
  },
  {
    label: 'Our Impact',
    href: '/impact'
  },
  {
    label: 'Partners',
    href: '/partners'
  },
  {
    label: 'About',
    href: '/about'
  },
  {
    label: 'Careers',
    href: '/careers'
  },
  {
    label: 'Contact',
    href: '/contact'
  }
]

export const footerNavigation = {
  main: [
    {
      title: 'Get Involved',
      links: [
        { label: 'Adopt a Dog', href: '/adopt' },
        { label: 'Foster a Dog', href: '/foster' },
        { label: 'Donate', href: '/donate' },
        { label: 'Volunteer', href: '/contact' },
        { label: 'Shop for a Cause', href: '/shop' }
      ]
    },
    {
      title: 'Learn More',
      links: [
        { label: 'Our Impact', href: '/impact' },
        { label: 'Success Stories', href: '/sponsor' },
        { label: 'Partner Network', href: '/partners' },
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'Report Abuse', href: '/report' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Refunds', href: '/refunds' }
      ]
    }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ]
}

export const socialLinks: SocialLink[] = [
  {
    platform: 'Facebook',
    href: 'https://facebook.com/doggzy',
    icon: 'facebook'
  },
  {
    platform: 'Instagram',
    href: 'https://instagram.com/doggzy',
    icon: 'instagram'
  },
  {
    platform: 'Twitter',
    href: 'https://twitter.com/doggzy',
    icon: 'twitter'
  },
  {
    platform: 'LinkedIn',
    href: 'https://linkedin.com/company/doggzy',
    icon: 'linkedin'
  },
  {
    platform: 'YouTube',
    href: 'https://youtube.com/doggzy',
    icon: 'youtube'
  }
]

export const ctaButton = {
  label: 'Donate Now',
  href: '/donate',
  variant: 'primary' as const
}
