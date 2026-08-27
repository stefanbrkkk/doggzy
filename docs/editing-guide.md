[Back to Docs Index](README.md)

# Editing Guide

All content lives in TypeScript files under `src/content/` and ships with the
deploy. There is no CMS and no database: editing means a commit, and the type
checker and the content checks catch most mistakes before anyone sees them.

Everything visitor-facing is in Serbian, Latin script. Cyrillic characters that
look identical to Latin ones (`о` vs `o`) break search and URLs, so
`npm run check:script` rejects them.

## Adding a dog

Open `src/content/dogs.ts` and add an entry to `dogs`.

```ts
{
  id: 'd-mrvica',                 // `d-` prefix, unique
  slug: 'mrvica',                 // becomes /psi/mrvica — Latin, lowercase, hyphens
  name: 'Mrvica',
  nameAccusative: 'Mrvicu',       // "za Mrvicu"
  nameDative: 'Mrvici',           // "Pomozi Mrvici"
  status: 'trazi-dom',            // trazi-dom | u-lecenju | udomljen | nestao
  ageLabel: '2 godine',
  sex: 'ženka',
  size: 'Mali',
  breedGuess: 'Mešanac, verovatno pinč',
  city: 'Beograd',
  shelter: 'Sklonište Zemun',
  arrivedAt: '2026-03-14',
  summary: '…',                   // one or two sentences, shown on the card
  story: ['…', '…'],              // paragraphs on the dog's own page
  traits: ['Dobra sa decom'],
  needs: [
    { label: 'Vakcina i čipovanje', cost: 3800, covered: 3800 },
  ],
  sponsorMonthly: 1500,
  art: { shape: 'bloom', from: 'var(--color-ember-300)', to: 'var(--color-iris-500)' },
  timeline: [
    {
      date: '2026-03-14',
      type: 'vet',                // prijava | vet | donacija | nega | udomljenje
      title: 'Rendgen i pregled',
      note: 'Potvrđena displazija kuka.',
      amount: 6400,               // dinars, when the entry is money in or out
      verified: true,             // only with a receipt or a vet's confirmation
    },
  ],
}
```

Three things matter more than the rest:

- **The declined forms.** Serbian inflects names, and the interface puts them
  straight after prepositions and verbs that govern a case. Get
  `nameAccusative` and `nameDative` right or the copy reads as broken Serbian.
- **`verified`.** Set it to `true` only where a receipt or a vet's confirmation
  exists. The site renders unverified entries differently on purpose; marking
  everything verified is the one edit that damages the project's whole premise.
- **The timeline is not deleted when treatment ends.** A finished case keeps its
  entries. That permanence is what makes the ledger worth reading.

`covered` must never exceed `cost`, and the sum of verified `donacija` amounts
must support what the coverage bars claim. `npm run check:figures` enforces both.

## Adding a product

Open `src/content/products.ts`.

```ts
{
  id: 'p-gps-ogrlica',            // `p-` prefix, unique
  slug: 'gps-ogrlica',
  name: 'GPS ogrlica',
  tagline: 'Ako pobegne, znaš gde je za 8 sekundi',
  description: '…',
  price: 12900,                   // whole dinars
  compareAt: 15900,               // optional, must be higher than `price`
  category: 'Tehnologija',        // one of the eight in ProductCategory
  tags: ['GPS', 'vodootporno'],
  inStock: true,
  badges: ['novo'],               // novo | bestseler | eko | ograničeno
  art: { shape: 'orbit', from: 'var(--color-signal-300)', to: 'var(--color-signal-700)' },
  impact: 'Jedna ogrlica plaća vakcinu i čipovanje jednog psa.',
  impactUnits: 1,
  impactCost: 3800,               // a real invoice from a dog's ledger
  specs: [{ label: 'Zaštita', value: 'IP67' }],
  releasedRank: 1,                // sort order for "Najnovije"
}
```

The impact claim is checked by multiplication, not trusted as prose:
`impactUnits × price × PROFIT_SHARE` must cover `impactCost`, and `impactCost`
must match a line item that actually appears in a dog's timeline. `PROFIT_SHARE`
is 0.4. A hoodie once claimed to pay for five microchips, which would have needed
1.098 RSD of profit per chip against a 3.800 RSD invoice; `check:figures` exists
because of that.

Do not add ratings, review counts, or any other number the site cannot show the
receipt for. The build rejects those fields.

## Adding a story

Open `src/content/stories.ts`. Set `dogSlug` so a reader can jump from the
narrative straight to that dog's ledger and check it. `body` is an array of
sections, each with an optional `heading` and its paragraphs.

## Artwork

There is no photography in this repository, and stock photos of dogs a rescue
has never met would undercut the point of the site. Every dog, product and story
carries an `art` descriptor instead, and the artwork is drawn deterministically
from it — the same entry produces the same image every time, with no raster file
involved.

```ts
art: { shape: 'orbit', from: 'var(--color-mint-400)', to: 'var(--color-iris-500)' }
```

`shape` is one of `orbit`, `waves`, `grid`, `bloom`, `pulse`, `ridge`, `prism`,
`trace`. `from` and `to` should be theme tokens rather than literal colours, so
the artwork follows the light and dark palettes. See `media-guide.md`.

## Navigation, contact details, routes

`src/config/site.ts` holds the site name, the canonical URL, the contact
details, and both navigation lists. Add a route there rather than hard-coding a
path in a component: `routes` is what links, the sitemap, breadcrumbs and the
structured data all read from.

## Before you commit

```bash
npm run check      # types, lint, script, contrast, figures, build
```

If you changed content that appears in a coverage bar, an impact claim, or the
transparency page, read what `check:figures` prints — it names the exact figure
it could not support.
