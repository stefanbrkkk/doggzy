/**
 * Product catalogue.
 *
 * There is no product photography in this repository, and shipping stock photos
 * of dogs a rescue has never met would undercut the whole point of the site. So
 * every product carries an `art` descriptor instead, and <ProductArt> renders a
 * deterministic generative cover from it — same product, same artwork, every time.
 *
 * Prices are whole dinars (RSD).
 */

import type { ArtDescriptor } from '@/lib/art'

export type ProductCategory =
  | 'Ležajevi'
  | 'Oprema'
  | 'Tehnologija'
  | 'Igračke'
  | 'Nega'
  | 'Odeća'
  | 'Hrana'
  | 'Putovanje'

export type ProductBadge = 'novo' | 'bestseler' | 'eko' | 'ograničeno'

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  price: number
  compareAt?: number
  category: ProductCategory
  tags: string[]
  inStock: boolean
  badges: ProductBadge[]
  art: ArtDescriptor
  /**
   * What the profit from a stated number of units pays for. Shown on the card
   * and in the cart.
   *
   * The claim used to be written freehand, and several did not survive
   * arithmetic: one hoodie was said to pay for five microchips, which needs
   * 1.098 RSD of *profit* per chip against a 3.800 RSD invoice. The two fields
   * below carry the sum the sentence makes, and `scripts/check-figures.mjs`
   * fails the build when `impactUnits × price × PROFIT_SHARE` no longer covers
   * `impactCost`, or when `impactCost` stops matching a real ledger invoice.
   */
  impact: string
  impactUnits: number
  impactCost: number
  specs: { label: string; value: string }[]
  /** Sort key for "najnovije"; lower is newer. */
  releasedRank: number
}

export const productCategories: ProductCategory[] = [
  'Ležajevi',
  'Oprema',
  'Tehnologija',
  'Igračke',
  'Nega',
  'Odeća',
  'Hrana',
  'Putovanje',
]

/**
 * Share of the retail price left after cost of goods and shipping.
 *
 * Deliberately conservative. Every impact claim below is arithmetic against
 * this number rather than against revenue — the shop promises to give away
 * profit, so a claim measured in revenue would promise more than it can pay.
 */
export const PROFIT_SHARE = 0.4

export const products: Product[] = [
  {
    id: 'p-ortho-lezaj',
    slug: 'ortopedski-lezaj',
    name: 'Ortopedski ležaj',
    tagline: 'Memorijska pena koja pamti stare zglobove',
    description:
      'Ležaj sa memorijskom penom od 8 cm i rashladnim slojem. Navlaka se skida i pere na 40°C, dno je protivklizno. Napravljen za pse koji su previše vremena proveli na betonu.',
    price: 11900,
    compareAt: 14900,
    category: 'Ležajevi',
    tags: ['memorijska pena', 'perivo', 'zglobovi'],
    inStock: true,
    badges: ['bestseler', 'eko'],
    art: { shape: 'bloom', from: 'var(--color-ember-400)', to: 'var(--color-iris-500)' },
    impact: 'Profit od dva ležaja pokriva jednu sterilizaciju.',
    impactUnits: 2,
    impactCost: 8500,
    specs: [
      { label: 'Dimenzije', value: '100 × 70 × 18 cm' },
      { label: 'Punjenje', value: 'Memorijska pena 8 cm' },
      { label: 'Navlaka', value: 'Reciklirani poliester, periva' },
    ],
    releasedRank: 4,
  },
  {
    id: 'p-am-bez-potezanja',
    slug: 'am-bez-potezanja',
    name: 'Am bez potezanja',
    tagline: 'Prednja kopča, nula pritiska na vrat',
    description:
      'Am sa prednjom kopčom od reciklirane gurtne. Četiri tačke podešavanja, reflektujući konac po celoj dužini, mekana postava na grudima.',
    price: 4290,
    category: 'Oprema',
    tags: ['bez potezanja', 'reflektujuće', 'reciklirano'],
    inStock: true,
    badges: ['bestseler', 'eko'],
    art: { shape: 'trace', from: 'var(--color-signal-400)', to: 'var(--color-iris-400)' },
    impact: 'Dva ama plaćaju drugu vakcinu za jedno štene.',
    impactUnits: 2,
    impactCost: 2600,
    specs: [
      { label: 'Veličine', value: 'XS – XL' },
      { label: 'Materijal', value: 'Reciklirani najlon' },
      { label: 'Kopče', value: 'Aluminijum, 4 tačke' },
    ],
    releasedRank: 6,
  },
  {
    id: 'p-gps-ogrlica',
    slug: 'gps-ogrlica',
    name: 'GPS ogrlica',
    tagline: 'Ako pobegne, znaš gde je za 8 sekundi',
    description:
      'Ogrlica sa GPS i LTE modulom, vodootporna po IP67. Postavljanje bezbedne zone i obaveštenje čim je pas napusti. Baterija traje do 7 dana.',
    price: 12900,
    category: 'Tehnologija',
    tags: ['GPS', 'vodootporno', 'baterija 7 dana'],
    inStock: true,
    badges: ['novo'],
    art: { shape: 'orbit', from: 'var(--color-signal-300)', to: 'var(--color-signal-700)' },
    impact: 'Jedna ogrlica plaća vakcinu i čipovanje jednog psa.',
    impactUnits: 1,
    impactCost: 3800,
    specs: [
      { label: 'Zaštita', value: 'IP67' },
      { label: 'Baterija', value: 'Do 7 dana' },
      { label: 'Preciznost', value: '± 3 m na otvorenom' },
    ],
    releasedRank: 1,
  },
  {
    id: 'p-slagalica',
    slug: 'slagalica-za-hranu',
    name: 'Slagalica za hranu',
    tagline: 'Obrok koji traje petnaest minuta umesto petnaest sekundi',
    description:
      'Tri nivoa težine u jednoj ploči. Usporava jelo, smanjuje nadutost i daje psu posao. Bez BPA, može u mašinu za sudove.',
    price: 2890,
    category: 'Igračke',
    tags: ['sporo jelo', 'mentalni rad', 'bez BPA'],
    inStock: true,
    badges: ['bestseler'],
    art: { shape: 'grid', from: 'var(--color-mint-400)', to: 'var(--color-signal-500)' },
    impact: 'Četiri slagalice plaćaju kontrolni pregled operisane noge.',
    impactUnits: 4,
    impactCost: 4500,
    specs: [
      { label: 'Prečnik', value: '28 cm' },
      { label: 'Nivoi', value: '3 težine' },
      { label: 'Održavanje', value: 'Mašina za sudove' },
    ],
    releasedRank: 7,
  },
  {
    id: 'p-konopci',
    slug: 'konopci-set',
    name: 'Konopci — set od 3',
    tagline: 'Organski pamuk koji čisti zube dok se pas igra',
    description:
      'Tri čvora različite tvrdoće od nebojenog organskog pamuka. Vlakna prolaze između zuba i skidaju naslage. Bez plastike u pakovanju.',
    price: 1990,
    category: 'Igračke',
    tags: ['organski pamuk', 'zubi', 'izdržljivo'],
    inStock: true,
    badges: ['eko'],
    art: { shape: 'waves', from: 'var(--color-ember-300)', to: 'var(--color-ember-600)' },
    impact: 'Sedam setova pokriva drugu vakcinu za dva štenceta.',
    impactUnits: 7,
    impactCost: 5200,
    specs: [
      { label: 'Sadržaj', value: '3 komada' },
      { label: 'Materijal', value: '100% organski pamuk' },
      { label: 'Pakovanje', value: 'Bez plastike' },
    ],
    releasedRank: 9,
  },
  {
    id: 'p-flasa',
    slug: 'putna-flasa',
    name: 'Putna flaša',
    tagline: 'Voda i činija u jednom pokretu palca',
    description:
      'Nerđajući čelik sa integrisanom činijom koja se otvara jednom rukom. Ne curi u rancu. Zadržava temperaturu vode šest sati.',
    price: 2490,
    category: 'Putovanje',
    tags: ['ne curi', 'čelik', 'jedna ruka'],
    inStock: true,
    badges: ['novo'],
    art: { shape: 'ridge', from: 'var(--color-signal-300)', to: 'var(--color-mint-500)' },
    impact: 'Sedam flaša plaća hranu za jednog psa do udomljenja.',
    impactUnits: 7,
    impactCost: 6000,
    specs: [
      { label: 'Zapremina', value: '550 ml' },
      { label: 'Materijal', value: 'Nerđajući čelik 304' },
      { label: 'Izolacija', value: '6 h' },
    ],
    releasedRank: 3,
  },
  {
    id: 'p-krofna',
    slug: 'krofna-lezaj',
    name: 'Krofna ležaj',
    tagline: 'Zid oko psa koji se plaši sopstvene senke',
    description:
      'Podignuti obod daje osećaj zaklona psima sa anksioznošću. Punjenje od recikliranih PET vlakana, cela krofna ide u veš mašinu.',
    price: 5900,
    category: 'Ležajevi',
    tags: ['anti-stres', 'perivo', 'reciklirano'],
    inStock: true,
    badges: ['eko'],
    art: { shape: 'pulse', from: 'var(--color-iris-400)', to: 'var(--color-ember-500)' },
    impact: 'Dve krofne plaćaju kontrolni pregled operisane noge.',
    impactUnits: 2,
    impactCost: 4500,
    specs: [
      { label: 'Prečnik', value: '70 cm' },
      { label: 'Punjenje', value: 'Reciklirana PET vlakna' },
      { label: 'Pranje', value: 'Celo, na 30°C' },
    ],
    releasedRank: 8,
  },
  {
    id: 'p-poslastice',
    slug: 'poslastice-za-obuku',
    name: 'Poslastice za obuku',
    tagline: 'Dovoljno male da ih daš stotinu puta',
    description:
      'Meki zalogaji od 1 grama, piletina kao jedini izvor mesa. Bez žitarica i konzervansa. Pakovanje se zatvara jednim pokretom.',
    price: 990,
    category: 'Hrana',
    tags: ['jedan izvor mesa', 'bez žitarica', 'obuka'],
    inStock: true,
    badges: ['bestseler'],
    art: { shape: 'bloom', from: 'var(--color-ember-400)', to: 'var(--color-mint-400)' },
    impact: 'Deset pakovanja plaća vakcinu i čipovanje jednog psa.',
    impactUnits: 10,
    impactCost: 3800,
    specs: [
      { label: 'Težina', value: '200 g' },
      { label: 'Sastav', value: '98% piletina' },
      { label: 'Veličina zalogaja', value: '1 g' },
    ],
    releasedRank: 10,
  },
  {
    id: 'p-nega-set',
    slug: 'set-za-negu',
    name: 'Set za negu',
    tagline: 'Mašinica koja ne vrišti dok šiša',
    description:
      'Bežična mašinica ispod 50 dB, dve četke i makaze sa zaobljenim vrhom. Namenjena psima koji paniče od zvuka.',
    price: 4900,
    category: 'Nega',
    tags: ['tiho', 'bežično', 'sve rase'],
    inStock: true,
    badges: [],
    art: { shape: 'prism', from: 'var(--color-iris-300)', to: 'var(--color-signal-600)' },
    impact: 'Tri seta plaćaju kontrolu kod oftalmologa.',
    impactUnits: 3,
    impactCost: 5200,
    specs: [
      { label: 'Buka', value: '< 50 dB' },
      { label: 'Autonomija', value: '4 h' },
      { label: 'Sadržaj', value: 'Mašinica, 2 četke, makaze' },
    ],
    releasedRank: 11,
  },
  {
    id: 'p-jakna',
    slug: 'reflektujuca-jakna',
    name: 'Reflektujuća jakna',
    tagline: 'Vidljiva sa 150 metara u mrklom mraku',
    description:
      'Vodoodbojni spoljni sloj, reflektujuće trake na bokovima i leđima, otvor za povodac. Zatvara se jednom čičak trakom preko grudi.',
    price: 4490,
    category: 'Odeća',
    tags: ['reflektujuće', 'vodoodbojno', 'podesivo'],
    inStock: true,
    badges: [],
    art: { shape: 'trace', from: 'var(--color-ember-500)', to: 'var(--color-signal-400)' },
    impact: 'Tri jakne pokrivaju kontrolu kod oftalmologa.',
    impactUnits: 3,
    impactCost: 5200,
    specs: [
      { label: 'Veličine', value: 'XS – XXL' },
      { label: 'Vodootpornost', value: '5.000 mm' },
      { label: 'Vidljivost', value: '150 m' },
    ],
    releasedRank: 5,
  },
  {
    id: 'p-cinija',
    slug: 'podignuta-cinija',
    name: 'Podignuta činija',
    tagline: 'Voda ostaje hladna do večeri',
    description:
      'Čelična činija sa rashladnim jezgrom na podignutom postolju. Manje opterećenja za vrat, manje prosute vode, protivklizno dno.',
    price: 3290,
    category: 'Oprema',
    tags: ['rashladno', 'protivklizno', 'čelik'],
    inStock: false,
    badges: [],
    art: { shape: 'ridge', from: 'var(--color-signal-400)', to: 'var(--color-iris-500)' },
    impact: 'Četiri činije plaćaju kontrolni pregled operisane noge.',
    impactUnits: 4,
    impactCost: 4500,
    specs: [
      { label: 'Zapremina', value: '900 ml' },
      { label: 'Visina', value: '18 cm' },
      { label: 'Materijal', value: 'Nerđajući čelik' },
    ],
    releasedRank: 12,
  },
  {
    id: 'p-duks',
    slug: 'duks-sa-portretom',
    name: 'Duks sa portretom',
    tagline: 'Tvoj pas, iscrtan linijom, na leđima',
    description:
      'Pošalješ fotografiju, naš ilustrator izvuče portret u jednoj liniji i odštampamo ga na duksu od 85% organskog pamuka. Izrada traje 7 radnih dana.',
    price: 5490,
    compareAt: 6900,
    category: 'Odeća',
    tags: ['personalizovano', 'organski pamuk', 'ručni crtež'],
    inStock: true,
    badges: ['bestseler', 'ograničeno'],
    art: { shape: 'prism', from: 'var(--color-ember-300)', to: 'var(--color-iris-600)' },
    impact: 'Dva duksa plaćaju vakcinu i čipovanje jednog psa.',
    impactUnits: 2,
    impactCost: 3800,
    specs: [
      { label: 'Materijal', value: '85% organski pamuk' },
      { label: 'Izrada', value: '7 radnih dana' },
      { label: 'Veličine', value: 'XS – XXL' },
    ],
    releasedRank: 2,
  },
]

const bySlug = new Map(products.map((product) => [product.slug, product]))
const byId = new Map(products.map((product) => [product.id, product]))

export function getProduct(id: string): Product | undefined {
  return byId.get(id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug)
}

export function relatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category === product.category,
  )
  const rest = products.filter(
    (candidate) => candidate.id !== product.id && candidate.category !== product.category,
  )
  return [...sameCategory, ...rest].slice(0, limit)
}
