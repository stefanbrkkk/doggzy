/**
 * Single source of truth for routes, contact details and brand metadata.
 * Every link in the app resolves through `routes` so a rename can never
 * leave a dead href behind.
 */

export const routes = {
  home: '/',
  report: '/prijava',
  dogs: '/psi',
  dog: (slug: string) => `/psi/${slug}`,
  donate: '/doniraj',
  shop: '/prodavnica',
  product: (slug: string) => `/prodavnica/${slug}`,
  cart: '/korpa',
  favorites: '/omiljeno',
  stories: '/price',
  story: (slug: string) => `/price/${slug}`,
  transparency: '/transparentnost',
  about: '/o-nama',
  contact: '/kontakt',
  privacy: '/privatnost',
  terms: '/uslovi',
  accessibility: '/pristupacnost',
  admin: '/admin',
  adminLogin: '/admin/login',
  adminDashboard: '/admin/dashboard',
} as const

export type StaticRoute = Extract<(typeof routes)[keyof typeof routes], string>

export const primaryNav = [
  {
    href: routes.report,
    label: 'Prijavi psa',
    description: 'Nestao, pronađen ili u nevolji — prijava traje minut.',
  },
  {
    href: routes.dogs,
    label: 'Psi',
    description: 'Upoznaj pse koji čekaju dom ili virtuelnog staratelja.',
  },
  {
    href: routes.transparency,
    label: 'Transparentnost',
    description: 'Gde ide svaki dinar — javno i po stavkama.',
  },
  { href: routes.shop, label: 'Prodavnica', description: 'Sav profit ide u negu pasa.' },
  {
    href: routes.stories,
    label: 'Priče',
    description: 'Ispričane od početka do kraja, sa dokazima.',
  },
] as const

export const secondaryNav = [
  { href: routes.about, label: 'O nama' },
  { href: routes.contact, label: 'Kontakt' },
  { href: routes.privacy, label: 'Privatnost' },
  { href: routes.terms, label: 'Uslovi korišćenja' },
  { href: routes.accessibility, label: 'Pristupačnost' },
] as const

export const site = {
  name: 'Doggzy',
  tagline: 'Pomoć psima koja se može proveriti.',
  description:
    'Doggzy povezuje skloništa, veterinare i ljude u Srbiji: prijava nestalih i ugroženih pasa, udomljavanje i virtuelno starateljstvo, donacije sa javnim dokazom kako je svaki dinar potrošen.',
  locale: 'sr-Latn-RS',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://doggzy.rs',
  email: 'zdravo@doggzy.rs',
  reportEmail: 'prijava@doggzy.rs',
  phone: '+381 60 000 0000',
  city: 'Beograd, Srbija',
  /**
   * Empty until the accounts exist.
   *
   * These were three plausible-looking handles nobody had registered — a link
   * to a profile that is not ours is the same kind of unverifiable claim as a
   * review count nobody left, on a site whose one rule is not to publish those.
   * Add real entries here and the footer renders them again.
   */
  social: [] as { label: string; href: string }[],
} as const
