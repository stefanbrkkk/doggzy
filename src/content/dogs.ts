import type { ArtDescriptor } from '@/lib/art'

/**
 * Dog listings and their public timelines.
 *
 * The timeline is the point of the whole platform: every entry says what
 * happened, what it cost, and whether there is evidence behind it. `verified`
 * is only true where a receipt or a vet's confirmation exists — the UI renders
 * unverified entries differently rather than hiding the distinction.
 */

export type DogStatus = 'trazi-dom' | 'u-lecenju' | 'udomljen' | 'nestao'

export type TimelineType = 'prijava' | 'vet' | 'donacija' | 'nega' | 'udomljenje'

export interface TimelineEvent {
  date: string
  type: TimelineType
  title: string
  note: string
  /** In dinars, when the entry represents money in or out. */
  amount?: number
  verified: boolean
}

export interface DogNeed {
  label: string
  cost: number
  covered: number
}

export interface Dog {
  id: string
  slug: string
  name: string
  /**
   * The name in the accusative and the dative.
   *
   * Serbian inflects names, and the UI puts them straight after prepositions
   * and verbs that govern a case: "Pomozi Mrvici", "za Mrvicu". A suffix rule
   * cannot derive these — a-stem declension plus palatalisation differs per
   * name, and Siva declines as an adjective — so both forms are authored here.
   */
  nameAccusative: string
  nameDative: string
  status: DogStatus
  ageLabel: string
  sex: 'ženka' | 'mužjak'
  size: 'Mali' | 'Srednji' | 'Veliki'
  breedGuess: string
  city: string
  shelter: string
  arrivedAt: string
  summary: string
  story: string[]
  traits: string[]
  needs: DogNeed[]
  /** Monthly virtual-adoption tier, in dinars. */
  sponsorMonthly: number
  art: ArtDescriptor
  timeline: TimelineEvent[]
}

/**
 * Status as a badge on one dog.
 *
 * Two of the four are participles and agree with the dog's sex — a female dog
 * marked `nestao` has to read "Nestala". The other two are verb phrases and are
 * already neutral.
 */
export function statusLabel(status: DogStatus, sex: Dog['sex']): string {
  const female = sex === 'ženka'
  switch (status) {
    case 'trazi-dom':
      return 'Traži dom'
    case 'u-lecenju':
      return 'U lečenju'
    case 'udomljen':
      return female ? 'Udomljena' : 'Udomljen'
    case 'nestao':
      return female ? 'Nestala' : 'Nestao'
  }
}

/** Status as a category over many dogs — always plural, so never gendered. */
export const statusFilterLabels: Record<DogStatus, string> = {
  'trazi-dom': 'Traže dom',
  'u-lecenju': 'U lečenju',
  udomljen: 'Udomljeni',
  nestao: 'Nestali',
}

export const dogs: Dog[] = [
  {
    id: 'd-mrvica',
    slug: 'mrvica',
    name: 'Mrvica',
    nameAccusative: 'Mrvicu',
    nameDative: 'Mrvici',
    status: 'trazi-dom',
    ageLabel: '2 godine',
    sex: 'ženka',
    size: 'Mali',
    breedGuess: 'Mešanac, verovatno pinč',
    city: 'Beograd',
    shelter: 'Sklonište Zemun',
    arrivedAt: '2026-03-14',
    summary:
      'Nađena je iza pijace u Zemunu, sa ogrlicom bez pločice. Niko se nije javio trideset dana.',
    story: [
      'Mrvica je stigla teška četiri kilograma, sa ranom na zadnjoj nozi koja je zarasla naopako. Prvo što je uradila u boksu bilo je da se sakrije ispod ćebeta i ostane tamo dva dana.',
      'Treće jutro je izašla sama. Od tada prilazi svakome ko čučne — ali samo ako čučneš. Ako stojiš, čeka.',
      'Noga je operisana u aprilu i danas trči bez šepanja. Traži stan bez mnogo stepenica i ljude koji su kod kuće uveče.',
    ],
    traits: ['Dobra sa decom', 'Mirna u stanu', 'Ne voli buku'],
    needs: [
      { label: 'Kontrolni pregled noge', cost: 4500, covered: 4500 },
      { label: 'Vakcina i čipovanje', cost: 3800, covered: 3800 },
      { label: 'Hrana do udomljenja', cost: 6000, covered: 2400 },
    ],
    sponsorMonthly: 1500,
    art: { shape: 'bloom', from: 'var(--color-ember-300)', to: 'var(--color-iris-500)' },
    timeline: [
      {
        date: '2026-03-14',
        type: 'prijava',
        title: 'Prijava preko sajta',
        note: 'Prolaznica je prijavila psa iza pijace. Ekipa je izašla za 40 minuta.',
        verified: true,
      },
      {
        date: '2026-03-15',
        type: 'vet',
        title: 'Prvi pregled',
        note: 'Rana na zadnjoj nozi, pothranjenost, bez čipa.',
        amount: 5200,
        verified: true,
      },
      {
        date: '2026-04-02',
        type: 'vet',
        title: 'Operacija noge',
        note: 'Korekcija loše zaraslog preloma. Račun objavljen u dokumentima.',
        amount: 18400,
        verified: true,
      },
      {
        date: '2026-04-03',
        type: 'donacija',
        title: 'Donacije pokrile operaciju',
        note: '23 donacije u dva dana.',
        amount: 18400,
        verified: true,
      },
      {
        date: '2026-05-20',
        type: 'nega',
        title: 'Kontrola',
        note: 'Hoda bez šepanja. Spremna za udomljenje.',
        amount: 4500,
        verified: true,
      },
    ],
  },
  {
    id: 'd-tesla',
    slug: 'tesla',
    name: 'Tesla',
    nameAccusative: 'Teslu',
    nameDative: 'Tesli',
    status: 'u-lecenju',
    ageLabel: '5 godina',
    sex: 'mužjak',
    size: 'Veliki',
    breedGuess: 'Mešanac ovčara',
    city: 'Novi Sad',
    shelter: 'Prihvatilište Futog',
    arrivedAt: '2026-06-02',
    summary: 'Ostao je vezan u dvorištu kad su se vlasnici odselili. Komšija ga je prijavio.',
    story: [
      'Tesla je proveo nepoznato koliko dana na lancu od metar i po. Kad je ekipa stigla, lanac je bio urastao u kožu vrata.',
      'Vrat se leči od početka juna. Uprkos svemu, Tesla ne reži ni na koga — ni na veterinara koji mu svakog dana menja zavoj.',
      'Kad zaraste, tražiće dvorište i nekoga ko razume da mu treba vremena da poveruje da niko ne odlazi.',
    ],
    traits: ['Blag', 'Uči brzo', 'Traži dvorište'],
    needs: [
      { label: 'Previjanje, 8 nedelja', cost: 22000, covered: 15200 },
      { label: 'Antibiotici', cost: 7400, covered: 7400 },
      { label: 'Sterilizacija', cost: 9000, covered: 0 },
    ],
    sponsorMonthly: 2500,
    art: { shape: 'ridge', from: 'var(--color-signal-300)', to: 'var(--color-iris-600)' },
    timeline: [
      {
        date: '2026-06-02',
        type: 'prijava',
        title: 'Prijava komšije',
        note: 'Prijava tipa „pas u opasnosti”. Ekipa izašla isti dan.',
        verified: true,
      },
      {
        date: '2026-06-02',
        type: 'vet',
        title: 'Hitna intervencija',
        note: 'Uklanjanje lanca, čišćenje rane, infuzija.',
        amount: 16800,
        verified: true,
      },
      {
        date: '2026-06-20',
        type: 'donacija',
        title: 'Kampanja za Teslu',
        note: '41 donacija.',
        amount: 22600,
        verified: true,
      },
      {
        date: '2026-07-28',
        type: 'nega',
        title: 'Rana se zatvara',
        note: 'Previjanje smanjeno na dva puta nedeljno.',
        amount: 3800,
        verified: true,
      },
    ],
  },
  {
    id: 'd-lima',
    slug: 'lima',
    name: 'Lima',
    nameAccusative: 'Limu',
    nameDative: 'Limi',
    status: 'trazi-dom',
    // Her own story puts the litter at ~3 weeks old in early March, so she was
    // born around mid-February. `arrivedAt` matches the first ledger entry —
    // the page states when she entered the register, and entries about her
    // cannot predate it.
    ageLabel: '6 meseci',
    sex: 'ženka',
    size: 'Srednji',
    breedGuess: 'Mešanac',
    city: 'Niš',
    shelter: 'Udruženje Šapa Niš',
    arrivedAt: '2026-03-08',
    summary: 'Jedna od pet iz legla nađenog u napuštenoj kućici kraj pruge. Sve su preživele.',
    story: [
      'Leglo je nađeno u martu, staro oko tri nedelje. Hranjeni su na dva sata, danonoćno, tri nedelje.',
      'Lima je bila najmanja i jedina koja je odbijala flašicu. Prihvatila je tek kad su je stavili uz sestru.',
      'Danas je najsmelija od svih pet. Prva ulazi u sobu, prva proba novu hranu, prva skoči u kola.',
    ],
    traits: ['Energična', 'Socijalizovana', 'Voli druge pse'],
    needs: [
      { label: 'Druga vakcina', cost: 2600, covered: 2600 },
      { label: 'Sterilizacija', cost: 8500, covered: 3000 },
    ],
    sponsorMonthly: 1200,
    art: { shape: 'orbit', from: 'var(--color-mint-400)', to: 'var(--color-signal-500)' },
    timeline: [
      {
        date: '2026-03-08',
        type: 'prijava',
        title: 'Prijava legla',
        note: 'Radnik na pruzi prijavio leglo bez majke.',
        verified: true,
      },
      // Limin deo, ne trošak celog legla. Stranica psa sabira ove iznose u
      // „Potrošeno na negu”, pa je zbir od 25.000 tvrdio da je toliko otišlo na
      // nju samu, dok su same beleške govorile da je novac pokrio petoro.
      {
        date: '2026-03-08',
        type: 'nega',
        title: 'Hraniteljstvo',
        note: 'Limin deo; leglo od petoro kod dve hraniteljske porodice koštalo je 12.000.',
        amount: 2400,
        verified: true,
      },
      {
        date: '2026-05-11',
        type: 'vet',
        title: 'Vakcinacija i čipovanje',
        note: 'Limin deo; za svih petoro 13.000.',
        amount: 2600,
        verified: true,
      },
      {
        date: '2026-07-04',
        type: 'udomljenje',
        title: 'Tri sestre udomljene',
        note: 'Lima i jedna sestra i dalje traže dom.',
        verified: true,
      },
    ],
  },
  {
    id: 'd-bora',
    slug: 'bora',
    name: 'Bora',
    nameAccusative: 'Boru',
    nameDative: 'Bori',
    status: 'udomljen',
    ageLabel: '7 godina',
    sex: 'mužjak',
    size: 'Srednji',
    breedGuess: 'Mešanac goniča',
    city: 'Kragujevac',
    shelter: 'Sklonište Kragujevac',
    arrivedAt: '2025-11-19',
    summary: 'Proveo je četiri godine u skloništu. Udomljen je u julu, u sedmoj godini.',
    story: [
      'Bora je bio pas kog svi zaobiđu: srednje veličine, srednjih godina, bez priče koja se lako prepričava.',
      'Objavili smo jedan video u kom čeka kod kapije. Za nedelju dana javilo se jedanaest ljudi.',
      'Živi u Kragujevcu, sa penzionerom koji ga vodi na Šumarice svako jutro u sedam.',
    ],
    traits: ['Smiren', 'Kućno vaspitan', 'Voli šetnje'],
    needs: [],
    sponsorMonthly: 0,
    art: { shape: 'trace', from: 'var(--color-ember-400)', to: 'var(--color-ember-700)' },
    timeline: [
      {
        date: '2025-11-19',
        type: 'prijava',
        title: 'Prelazak u našu evidenciju',
        note: 'Sklonište uključeno u pilot mrežu.',
        verified: true,
      },
      {
        date: '2026-06-12',
        type: 'nega',
        title: 'Stomatološka intervencija',
        note: 'Uklonjena tri zuba.',
        amount: 11200,
        verified: true,
      },
      {
        date: '2026-07-19',
        type: 'udomljenje',
        title: 'Udomljen',
        note: 'Kontrola nakon 30 dana — sve u redu.',
        verified: true,
      },
    ],
  },
  {
    id: 'd-siva',
    slug: 'siva',
    name: 'Siva',
    nameAccusative: 'Sivu',
    nameDative: 'Sivoj',
    status: 'nestao',
    ageLabel: '4 godine',
    sex: 'ženka',
    size: 'Srednji',
    breedGuess: 'Mešanac, sivo-braon',
    city: 'Beograd — Karaburma',
    shelter: 'Prijava vlasnika',
    arrivedAt: '2026-08-18',
    summary:
      'Pobegla je od petarde 18. avgusta oko 21h, kod OŠ „Vuk Karadžić”. Nosi crvenu ogrlicu bez pločice.',
    story: [
      'Siva je plaha na jake zvuke. Neće prići nepoznatoj osobi, ali se zaustavlja ako čučneš i ne gledaš je direktno.',
      'Poslednji prijavljeni trag: 19. avgusta ujutru, kod ulaza u park Ćalije.',
      'Ako je vidiš, nemoj da je juriš — pošalji prijavu sa lokacijom i vremenom.',
    ],
    traits: ['Plaha', 'Bez pločice', 'Crvena ogrlica'],
    needs: [],
    sponsorMonthly: 0,
    art: { shape: 'pulse', from: 'var(--color-rose-400)', to: 'var(--color-iris-500)' },
    timeline: [
      {
        date: '2026-08-18',
        type: 'prijava',
        title: 'Prijava nestanka',
        note: 'Vlasnica prijavila preko sajta u 21:40.',
        verified: true,
      },
      {
        date: '2026-08-19',
        type: 'prijava',
        // Titled as reported, not confirmed: the badge beside it says
        // "Nepotvrđeno", and the one place the two could disagree is exactly
        // the row a sceptical reader checks first.
        title: 'Prijavljeno viđenje',
        note: 'Prijava prolaznika, park Ćalije, 07:15.',
        verified: false,
      },
    ],
  },
  {
    id: 'd-pahulja',
    slug: 'pahulja',
    name: 'Pahulja',
    nameAccusative: 'Pahulju',
    nameDative: 'Pahulji',
    status: 'trazi-dom',
    ageLabel: '10 godina',
    sex: 'ženka',
    size: 'Mali',
    breedGuess: 'Mešanac bišona',
    city: 'Subotica',
    shelter: 'Sklonište Subotica',
    arrivedAt: '2026-02-27',
    summary: 'Ostala je sama kad je vlasnica otišla u dom. Ima kataraktu na oba oka.',
    story: [
      'Pahulja vidi obrise. To joj je dovoljno da nađe vrata, krevet i osobu koja sedi mirno.',
      'Ne voli promene rasporeda nameštaja i to je jedina stvar oko koje je zahtevna.',
      'Tražimo dom za starijeg psa — nekoga ko zna da deset godina nije kraj, nego samo drugačiji početak.',
    ],
    traits: ['Slabovida', 'Vrlo mirna', 'Za stariji par'],
    needs: [
      { label: 'Kapi za oči, godišnje', cost: 9600, covered: 4800 },
      { label: 'Kontrola kod oftalmologa', cost: 5200, covered: 5200 },
    ],
    sponsorMonthly: 1000,
    art: { shape: 'waves', from: 'var(--color-signal-200)', to: 'var(--color-iris-400)' },
    timeline: [
      {
        date: '2026-02-27',
        type: 'prijava',
        title: 'Preuzeta iz stana',
        note: 'Prijava socijalne radnice.',
        verified: true,
      },
      {
        date: '2026-03-05',
        type: 'vet',
        title: 'Oftalmološki pregled',
        note: 'Katarakta na oba oka, bez indikacije za operaciju.',
        amount: 5200,
        verified: true,
      },
      {
        date: '2026-06-01',
        type: 'donacija',
        title: 'Virtuelni staratelji',
        note: 'Mesečne pretplate pokrivaju polovinu godišnje terapije.',
        amount: 4800,
        verified: true,
      },
    ],
  },
]

const dogBySlug = new Map(dogs.map((dog) => [dog.slug, dog]))

export interface LedgerLineItem {
  label: string
  cost: number
  /** The dog whose public ledger carries this invoice, so the figure is checkable. */
  dogName: string
  dogSlug: string
}

/**
 * Every funding line published on a dog's page, cheapest first.
 *
 * The impact calculator used to carry its own hardcoded list, which is how it
 * ended up quoting 2.600 for "Vakcina i čipovanje" (the real invoice is 3.800;
 * 2.600 is Lima's second vaccine) and offering a 600 RSD food line that appears
 * in no ledger at all — under a heading promising these are not estimates.
 * Reading them from the data makes that promise true by construction.
 *
 * Not deduplicated by label: two dogs can be quoted different prices for the
 * same procedure, and flattening that would hide exactly the kind of detail
 * this site exists to publish. Each entry names its dog instead.
 */
export function ledgerLineItems(): LedgerLineItem[] {
  return dogs
    .flatMap((dog) =>
      dog.needs.map((need) => ({
        label: need.label,
        cost: need.cost,
        dogName: dog.name,
        dogSlug: dog.slug,
      })),
    )
    .sort((a, b) => a.cost - b.cost)
}

export function getDog(slug: string): Dog | undefined {
  return dogBySlug.get(slug)
}

export function dogNeedTotals(dog: Dog): { cost: number; covered: number; progress: number } {
  const cost = dog.needs.reduce((sum, need) => sum + need.cost, 0)
  const covered = dog.needs.reduce((sum, need) => sum + need.covered, 0)
  return { cost, covered, progress: cost === 0 ? 1 : covered / cost }
}
