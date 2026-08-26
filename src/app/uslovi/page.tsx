import type { Metadata } from 'next'
import { routes, site } from '@/config/site'
import { LegalPage, type LegalSection } from '@/components/ui/legal-page'

export const metadata: Metadata = {
  title: 'Uslovi korišćenja',
  description: 'Pravila korišćenja sajta, prijava, donacija i prodavnice.',
  alternates: { canonical: routes.terms },
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Šta ovaj sajt jeste',
    paragraphs: [
      'Doggzy je platforma koja povezuje ljude, skloništa i veterinare u Srbiji. Prijave prosleđujemo partnerima na terenu, ali sami ne držimo pse i nismo hitna služba.',
      'Ako je životinja u neposrednoj opasnosti, pozovi komunalnu zoohigijenu svog grada ili broj 112 — i pošalji prijavu, da bismo mogli da pratimo slučaj.',
    ],
  },
  {
    heading: 'Prijave',
    paragraphs: [
      'Prijavljivanjem potvrđuješ da su podaci koje šalješ tačni koliko znaš i da imaš pravo da podeliš fotografiju koju prilažeš.',
      'Zadržavamo pravo da ne objavimo prijavu koja je očigledno lažna, uvredljiva ili sadrži lične podatke trećih lica.',
    ],
  },
  {
    heading: 'Donacije',
    paragraphs: [
      'Donacija je dobrovoljna i nepovratna. Namenske donacije koristimo za psa kojeg si izabrao; ako je njegovo lečenje u međuvremenu pokriveno, javljamo ti se pre preusmeravanja.',
      'Višak sredstava iznad potrebe konkretnog psa odlazi u fond za hitne slučajeve i to zapisujemo u dnevnik tog psa.',
    ],
  },
  {
    heading: 'Prodavnica',
    paragraphs: [
      'Cene su iskazane u dinarima. Naplata trenutno nije uključena — dok se ne poveže, porudžbine dogovaramo mejlom.',
      'Sav profit od prodaje odlazi u negu pasa i evidentira se u javnom dnevniku, isto kao donacije.',
    ],
    bullets: [
      'Pravo na odustanak: 14 dana od prijema, u skladu sa Zakonom o zaštiti potrošača.',
      'Personalizovani proizvodi (npr. duks sa portretom) izuzeti su od prava na odustanak, osim u slučaju greške u izradi.',
    ],
  },
  {
    heading: 'Sadržaj i autorstvo',
    paragraphs: [
      'Tekstovi, ilustracije i podaci na sajtu pripadaju Doggzy projektu. Slobodno ih citiraj uz navođenje izvora.',
      'Fotografije koje šalješ uz prijavu ostaju tvoje; daješ nam dozvolu da ih objavimo u okviru potrage ili stranice psa.',
    ],
  },
  {
    heading: 'Odgovornost',
    paragraphs: [
      'Trudimo se da svi podaci na sajtu budu tačni i ažurni, ali ne možemo garantovati ishod nijedne prijave ni raspoloživost bilo kog psa u datom trenutku.',
      `Za sva pitanja u vezi sa ovim uslovima piši na ${site.email}.`,
    ],
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Pravno"
      title="Uslovi korišćenja"
      intro="Pravila koja važe kad koristiš prijavu, doniraš ili poručuješ iz prodavnice."
      updated="26. avgust 2026."
      sections={SECTIONS}
    />
  )
}
