import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/metadata'
import { routes, site } from '@/config/site'
import { LegalPage, type LegalSection } from '@/components/ui/legal-page'

export const metadata: Metadata = pageMetadata({
  title: 'Politika privatnosti',
  description: 'Koje podatke prikupljamo, zašto, koliko dugo ih čuvamo i kako ih možeš obrisati.',
  path: routes.privacy,
})

const SECTIONS: LegalSection[] = [
  {
    heading: 'Ko obrađuje podatke',
    paragraphs: [
      `Podatke prikuplja i obrađuje Doggzy (${site.city}). Za sva pitanja o podacima piši na ${site.email}.`,
      'Registracija udruženja je u toku. Do njenog završetka, rukovalac podacima je osoba koja vodi projekat, i ista pravila važe i posle registracije.',
    ],
  },
  {
    heading: 'Šta prikupljamo',
    paragraphs: [
      'Prikupljamo samo ono što je potrebno da bismo mogli da odgovorimo ili postupimo.',
    ],
    bullets: [
      'Prijava psa: tip prijave, lokacija, opis, po izboru fotografija, i tvoje ime i kontakt (telefon ili email).',
      'Kontakt forma: ime, email, tema i tekst poruke.',
      'Korpa i lista omiljenih: čuvaju se isključivo u tvom pregledaču (localStorage) i ne šalju se nama.',
      'Izbor teme (tamna ili svetla): takođe samo u tvom pregledaču.',
      'Oznaka da si već posetio sajt u ovoj sesiji: čuva se u sessionStorage da ti se uvodna animacija ne prikazuje ponovo, i briše se kad zatvoriš pregledač.',
    ],
  },
  {
    heading: 'Šta je javno, a šta nije',
    paragraphs: [
      'Kod prijave nestalog ili pronađenog psa javno objavljujemo opis i lokaciju — to je jedini način da potraga ima smisla. Fotografija koju priložiš za sada stiže samo našem timu; kada povežemo skladište, objavljivaćemo je uz potragu i to ćemo prvo zapisati ovde.',
      'Tvoje ime, telefon i email nikada nisu javni. Vidi ih naš tim i sklonište koje preuzima slučaj.',
    ],
  },
  {
    heading: 'Zašto smemo da ih obrađujemo',
    paragraphs: [
      'Prijave i poruke obrađujemo na osnovu tvoje saglasnosti, koju daješ slanjem forme, i na osnovu legitimnog interesa da odgovorimo na prijavu o životinji u nevolji.',
      'Saglasnost možeš da povučeš u svakom trenutku, pisanjem na naš email.',
    ],
  },
  {
    heading: 'Koliko dugo čuvamo',
    paragraphs: [
      'Prijave čuvamo dok slučaj traje i još dve godine posle toga, jer se nestali psi ponekad pronađu mnogo kasnije i stara prijava tada postane ključna.',
      'Poruke sa kontakt forme čuvamo dve godine.',
      'Podatke iz tvog pregledača (korpa, omiljeno, tema) brišeš sam, brisanjem podataka sajta u pregledaču.',
    ],
  },
  {
    heading: 'Kome prosleđujemo',
    paragraphs: [
      'Prijave prosleđujemo partnerskom skloništu ili volonterskoj ekipi u tvom gradu, koji su obavezani istim pravilima.',
      'Za slanje email obaveštenja koristimo servis Resend. Ne prodajemo podatke i ne koristimo ih za reklamiranje.',
    ],
  },
  {
    heading: 'Kolačići i merenje posete',
    paragraphs: [
      'Ne postavljamo kolačiće za praćenje i ne koristimo alate za analitiku koji te prate između sajtova.',
      'Podaci koje sajt čuva u tvom pregledaču su tvoja korpa, lista omiljenih, izbor teme i oznaka da si već video uvodnu animaciju u ovoj sesiji. Poslednja se briše čim zatvoriš pregledač; ostale ostaju dok ih sam ne obrišeš.',
    ],
  },
  {
    heading: 'Tvoja prava',
    paragraphs: [
      'Imaš pravo na pristup svojim podacima, ispravku, brisanje, ograničenje obrade i prenosivost, u skladu sa Zakonom o zaštiti podataka o ličnosti.',
    ],
    bullets: [
      `Zahtev šalješ na ${site.email} — odgovaramo u roku od 30 dana.`,
      'Ako smatraš da ti je pravo povređeno, možeš se obratiti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Pravno"
      title="Politika privatnosti"
      intro="Kratko i bez pravničkog zamagljivanja: prikupljamo malo, čuvamo kratko i ne prodajemo ništa."
      updated="26. avgust 2026."
      sections={SECTIONS}
    />
  )
}
