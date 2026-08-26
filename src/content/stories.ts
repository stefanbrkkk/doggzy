import type { ArtDescriptor } from '@/lib/art'

/**
 * Long-form stories. Each one is tied to a dog, so a reader can jump straight
 * from the narrative to that dog's public ledger and check it themselves.
 */

export interface Story {
  slug: string
  title: string
  dek: string
  publishedAt: string
  author: string
  readingMinutes: number
  dogSlug?: string
  art: ArtDescriptor
  pullQuote: string
  body: { heading?: string; paragraphs: string[] }[]
}

export const stories: Story[] = [
  {
    slug: 'cetrdeset-minuta',
    title: 'Četrdeset minuta',
    dek: 'Koliko je trebalo od prijave sa telefona do trenutka kad je Mrvica bila u kolima.',
    publishedAt: '2026-04-11',
    author: 'Redakcija Doggzy',
    readingMinutes: 4,
    dogSlug: 'mrvica',
    art: { shape: 'trace', from: 'var(--color-ember-300)', to: 'var(--color-iris-500)' },
    pullQuote:
      'Prijava nije obrazac. To je sat koji počinje da otkucava u trenutku kad neko odluči da ne prođe pored.',
    body: [
      {
        paragraphs: [
          'U 17:12 jedna žena je zastala iza pijace u Zemunu jer je nešto videla između dva kontejnera. U 17:14 je poslala prijavu sa telefona: tip „pas u opasnosti”, lokacija, jedna fotografija, jedna rečenica opisa.',
          'U 17:19 je prijava stigla do dežurnog. U 17:52 su kola bila tamo.',
        ],
      },
      {
        heading: 'Zašto merimo minute',
        paragraphs: [
          'Kod povređenog psa razlika između četrdeset minuta i četiri sata nije nijansa. To je razlika između rane koja se čisti i rane koja se operiše, između računa od pet i računa od dvadeset hiljada dinara.',
          'Zato je vreme do izlaska ekipe jedan od brojeva koje objavljujemo. Ne zato što je uvek dobar, nego zato što ne može da se popravi ono što se ne meri.',
        ],
      },
      {
        heading: 'Šta se desilo posle',
        paragraphs: [
          'Mrvica je imala loše zarastao prelom zadnje noge. Operacija je koštala 18.400 dinara i pokrilo ju je dvadeset troje ljudi za dva dana.',
          'Račun je objavljen na njenoj stranici, uz nalaz veterinara. Danas trči bez šepanja i traži dom.',
        ],
      },
    ],
  },
  {
    slug: 'sta-radi-jedan-lanac',
    title: 'Šta radi jedan lanac',
    dek: 'Tesla je ostao vezan kad su se ljudi odselili. Ovo je račun za osam nedelja lečenja.',
    publishedAt: '2026-07-30',
    author: 'Redakcija Doggzy',
    readingMinutes: 6,
    dogSlug: 'tesla',
    art: { shape: 'ridge', from: 'var(--color-signal-300)', to: 'var(--color-iris-600)' },
    pullQuote:
      'Nije nas iznenadilo stanje vrata. Iznenadilo nas je što je i dalje mahao repom kad smo prišli.',
    body: [
      {
        paragraphs: [
          'Komšija je poslao prijavu u 8:40 ujutru. Napisao je da ljudi nisu tu „bar dve nedelje” i da pas ne laje više.',
          'Lanac je bio urastao u kožu. Prva intervencija je trajala tri sata i koštala 16.800 dinara.',
        ],
      },
      {
        heading: 'Sedam nedelja, stavku po stavku',
        paragraphs: [
          'Previjanja: 22.000 dinara, od čega je do sada pokriveno 15.200. Antibiotici: 7.400, pokriveno u celosti. Sterilizacija: 9.000, još nije pokrivena.',
          'Svaka od ovih stavki ima račun na Teslinoj stranici. To je jedini način na koji donator može da proveri da je novac otišao tamo gde smo rekli.',
        ],
      },
      {
        heading: 'Šta sad',
        paragraphs: [
          'Rana se zatvara. Kad zaraste, Tesla traži dvorište i strpljenje.',
          'Do tada ga drži četrdeset jedan čovek koji je uplatio u junu.',
        ],
      },
    ],
  },
  {
    slug: 'pas-kog-svi-zaobidju',
    title: 'Pas kog svi zaobiđu',
    dek: 'Bora je čekao četiri godine. Onda je jedan video promenio sve za nedelju dana.',
    publishedAt: '2026-08-02',
    author: 'Redakcija Doggzy',
    readingMinutes: 5,
    dogSlug: 'bora',
    art: { shape: 'bloom', from: 'var(--color-ember-400)', to: 'var(--color-ember-700)' },
    pullQuote:
      'Nije mu falilo ništa. To je i bio problem — nije imao priču koja se lako prepričava.',
    body: [
      {
        paragraphs: [
          'Štenci se udome za nedelje. Psi sa dramatičnom povredom se udome jer imaju priču. Bora nije bio ni jedno ni drugo: sedam godina, srednja veličina, zdrav, miran.',
          'Četiri godine je bio na spisku bez ijednog upita.',
        ],
      },
      {
        heading: 'Jedan snimak',
        paragraphs: [
          'Snimili smo trideset sekundi kako čeka kod kapije svako jutro u sedam, jer je to sat kad je nekad izlazio u šetnju.',
          'Za nedelju dana javilo se jedanaest ljudi.',
        ],
      },
      {
        heading: 'Šta smo iz toga naučili',
        paragraphs: [
          'Nedostatak priče nije nedostatak razloga. To je nedostatak nekoga ko će je ispričati.',
          'Od tada svaki pas u našoj evidenciji dobija bar jedan snimak i jedan tekst. Ne zato što je lepo, nego zato što radi.',
        ],
      },
    ],
  },
]

const storyBySlug = new Map(stories.map((story) => [story.slug, story]))

export function getStory(slug: string): Story | undefined {
  return storyBySlug.get(slug)
}
