#!/usr/bin/env node
import { readFileSync } from 'node:fs'

/**
 * Guards every money claim on the site against the dog ledgers.
 *
 * The site's whole premise is that a figure on a marketing surface is the same
 * figure as the invoice on a dog's page. That held right up until someone typed
 * a number from memory: "Vakcina i čipovanje" cost 2.600 in the donation form
 * and 3.800 in Mrvica's ledger, the impact calculator offered a 600 RSD food
 * line that appeared in no ledger at all, and one hoodie was said to pay for
 * five microchips.
 *
 * Parses the source rather than importing it, so it runs without a build step
 * — same as the other check scripts here.
 *
 *   npm run check:figures
 */

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

let failures = 0
const fail = (message) => {
  failures += 1
  console.log(`  FAIL ${message}`)
}
const pass = (message) => console.log(`  OK   ${message}`)

// ------------------------------------------------------------ ledger costs --
const dogsSource = read('src/content/dogs.ts')
const needPattern = /\{ label: '([^']+)', cost: (\d+), covered: (\d+) \}/g

const ledger = new Map()
for (const match of dogsSource.matchAll(needPattern)) {
  const [, label, cost, covered] = match
  ledger.set(Number(cost), label)
  if (Number(covered) > Number(cost)) {
    fail(`„${label}”: pokriveno ${covered} je više od cene ${cost}`)
  }
}

if (ledger.size === 0) {
  fail('nijedna stavka nije pronađena u dnevnicima pasa — provera ne bi ništa dokazala')
} else {
  pass(`${ledger.size} stavki u dnevnicima pasa`)
}

// -------------------------------------------- donation form covers the same --
const donateSource = read('src/components/donate/donate-form.tsx')
const coversPattern = /\{ min: (\d+), text: '([^']+)' \}/g

for (const match of donateSource.matchAll(coversPattern)) {
  const amount = Number(match[1])
  // The final entry is the "everything below the cheapest invoice" fallback.
  if (amount === 0) continue
  if (ledger.has(amount)) {
    pass(`donacija ${amount} = „${ledger.get(amount)}”`)
  } else {
    fail(`donacija tvrdi ${amount} RSD, a nijedan pas nema takav račun`)
  }
}

// --------------------------------------------------- product impact claims --
const productsSource = read('src/content/products.ts')
const profitShare = Number(productsSource.match(/PROFIT_SHARE = ([\d.]+)/)?.[1])

if (!Number.isFinite(profitShare) || profitShare <= 0 || profitShare > 1) {
  fail(`PROFIT_SHARE nije upotrebljiv broj: ${profitShare}`)
}

const productPattern =
  /name: '([^']+)',[\s\S]*?price: (\d+),[\s\S]*?impact: '([^']+)',\s*impactUnits: (\d+),\s*impactCost: (\d+),/g

let productCount = 0
for (const match of productsSource.matchAll(productPattern)) {
  const [, name, price, claim, units, cost] = match
  productCount += 1

  const profit = Number(price) * Number(units) * profitShare
  if (profit < Number(cost)) {
    fail(
      `„${name}”: ${units} × ${price} × ${profitShare} = ${Math.round(profit)} RSD profita ne pokriva ${cost} RSD — „${claim}”`,
    )
    continue
  }
  if (!ledger.has(Number(cost))) {
    fail(`„${name}”: obećava ${cost} RSD, a nijedan pas nema takav račun`)
    continue
  }
  pass(`„${name}” pokriva „${ledger.get(Number(cost))}”`)
}

if (productCount === 0) {
  fail('nijedan proizvod nije pronađen — provera ne bi ništa dokazala')
}

// ------------------------------------------------ tvrdnje bez pokrića -------
// A site whose one rule is "if it cannot be checked, we do not publish it as
// fact" had 4.9 stars from 214 reviews on a shop that has never taken an order,
// rendered on every product page and marked up as `aggregateRating` — the form
// a search engine turns into stars. These are the shapes that keep coming back.
const FABRICATIONS = [
  { pattern: /aggregateRating/, what: 'aggregateRating u strukturiranim podacima' },
  { pattern: /\brating:\s*[\d.]+/, what: 'ocena proizvoda' },
  { pattern: /\breviews:\s*\d+/, what: 'broj ocena' },
  { pattern: /nonprofitStatus/, what: 'nonprofitStatus bez registracije' },
]

for (const file of ['src/content/products.ts', 'src/lib/structured-data.ts']) {
  const source = read(file)
  for (const { pattern, what } of FABRICATIONS) {
    // Comments explaining why something is absent must not trip the check.
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
    if (pattern.test(code)) fail(`${file}: ${what}`)
  }
}
if (failures === 0) pass('nema tvrdnji koje sajt ne može da potkrepi')

console.log(
  failures === 0
    ? '\ncheck-figures: svaki iznos ima pokriće u dnevniku.'
    : `\ncheck-figures: ${failures} nepokrivenih tvrdnji.`,
)
process.exit(failures === 0 ? 0 : 1)
