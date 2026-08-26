import type { Metadata } from 'next'
import { routes, site } from '@/config/site'
import { LegalPage, type LegalSection } from '@/components/ui/legal-page'

export const metadata: Metadata = {
  title: 'Pristupačnost',
  description: 'Šta smo uradili da sajt bude upotrebljiv svima i šta još nije rešeno.',
  alternates: { canonical: routes.accessibility },
}

const SECTIONS: LegalSection[] = [
  {
    heading: 'Cilj',
    paragraphs: [
      'Ciljamo na nivo WCAG 2.2 AA. Neke stvari smo ispunili, neke još nismo — ovde piše i jedno i drugo.',
    ],
  },
  {
    heading: 'Šta je urađeno',
    paragraphs: [],
    bullets: [
      'Ceo sajt se koristi tastaturom, uključujući prijavu psa, korpu i sve dijaloge.',
      'Fokus je uvek vidljiv i ne gubi se kad se dijalog zatvori — vraća se na element koji ga je otvorio.',
      'Kontrast teksta u obe teme ispunjava AA odnos od 4.5:1 za osnovni tekst.',
      'Poštujemo sistemsko podešavanje „smanji animacije”: dekorativne animacije se gase, a prelazi svode na minimum.',
      'Svaka slika i ilustracija ima tekstualni opis, a dekorativni elementi su sakriveni od čitača ekrana.',
      'Forme imaju povezane oznake, opise grešaka i najave promena koraka.',
      'Postoji prečica „Pređi na sadržaj” kao prvi element na stranici.',
      'Brojevi u statistikama koriste tabelarne cifre, pa se ne pomeraju dok se animiraju.',
    ],
  },
  {
    heading: 'Šta još nije rešeno',
    paragraphs: [
      'Sajt nije prošao nezavisnu reviziju pristupačnosti niti testiranje sa korisnicima čitača ekrana. Dok se to ne desi, ova stranica opisuje naše provere, ne tuđu potvrdu.',
    ],
    bullets: [
      'Nemamo verziju sadržaja na ćirilici.',
      'Generisane ilustracije nose opšti opis, ne opis konkretnog psa.',
      'Tabela javnog dnevnika na vrlo uskim ekranima prelazi u složeni raspored koji još nismo testirali sa svim čitačima ekrana.',
    ],
  },
  {
    heading: 'Prijavi problem',
    paragraphs: [
      `Ako nešto ne možeš da koristiš, piši na ${site.email} i opiši šta si pokušao i sa kojim uređajem. Odgovaramo u roku od dva radna dana, a ozbiljne prepreke rešavamo prioritetno.`,
    ],
  },
]

export default function AccessibilityPage() {
  return (
    <LegalPage
      eyebrow="Pristupačnost"
      title="Izjava o pristupačnosti"
      intro="Sajt treba da radi i bez miša, i bez animacija, i sa čitačem ekrana."
      updated="26. avgust 2026."
      sections={SECTIONS}
    />
  )
}
