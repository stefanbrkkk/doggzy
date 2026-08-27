#!/usr/bin/env node
import { chromium } from 'playwright'
import { resolveChromium } from './chromium-path.mjs'
import { setTimeout as sleep } from 'node:timers/promises'

/**
 * Console audit against a development server.
 *
 * `scripts/e2e.mjs` drives the production build, which is the right place to
 * measure behaviour — but React ships its hydration diffing only in
 * development, and StrictMode (on, in next.config.ts) only double-invokes
 * render there. A whole class of defect is therefore invisible to that suite:
 * the generative artwork consumed a mutable pseudo-random sequence inside a
 * child component, so the second StrictMode pass drew from further along than
 * the server had and React threw the served document away. Production said
 * nothing. This is the suite that would have caught it.
 *
 *   npm run dev -- -p 3100 &   # then
 *   npm run check:console
 */

const BASE = process.env.DEV_BASE_URL ?? `http://localhost:${process.env.DEV_PORT ?? 3100}`

const ROUTES = [
  '/',
  '/prijava',
  '/psi',
  '/psi/mrvica',
  '/psi/siva',
  '/doniraj',
  '/prodavnica',
  '/prodavnica/gps-ogrlica',
  '/korpa',
  '/omiljeno',
  '/price',
  '/price/cetrdeset-minuta',
  '/transparentnost',
  '/o-nama',
  '/kontakt',
  '/privatnost',
  '/uslovi',
  '/pristupacnost',
]

/** Noise that is expected and carries no defect. */
const IGNORED = [
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  // The 404 route answers 404 by design; the browser logs the document itself.
  /Failed to load resource.*404/i,
]

let failed = 0
const record = (page, sink) => {
  page.on('console', (message) => {
    if (message.type() !== 'error' && message.type() !== 'warning') return
    const text = message.text()
    if (IGNORED.some((pattern) => pattern.test(text))) return
    sink.push(`[${message.type()}] ${text.replace(/\s+/g, ' ').slice(0, 240)}`)
  })
  page.on('pageerror', (error) =>
    sink.push(`[pageerror] ${error.message.replace(/\s+/g, ' ').slice(0, 240)}`),
  )
}

const report = (label, messages) => {
  const unique = [...new Set(messages)]
  if (unique.length === 0) {
    console.log(`  ok   ${label}`)
    return
  }
  failed += 1
  console.log(`  FAIL ${label}`)
  for (const message of unique) console.log(`       ${message}`)
}

const browser = await chromium.launch({
  executablePath: resolveChromium(),
  args: [
    '--no-sandbox',
    '--no-proxy-server',
    '--use-gl=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
})

const fresh = async (width = 1440, height = 900) => {
  const context = await browser.newContext({
    viewport: { width, height },
    hasTouch: width < 600,
    isMobile: width < 600,
  })
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  return context
}

console.log('\nRute')
for (const route of ROUTES) {
  const context = await fresh()
  const page = await context.newPage()
  const messages = []
  record(page, messages)
  await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 90000 })
  await sleep(2800)
  report(route, messages)
  await context.close()
}

// A first visit runs the curtain, the entrance choreography and the whole
// gated hero — none of which the routes above exercise, because they all
// arrive with the session flag already set.
console.log('\nPrva poseta, sa zavesom')
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const messages = []
  record(page, messages)
  await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 90000 })
  await sleep(6000)
  report('/ (bez zastavice u sesiji)', messages)
  await context.close()
}

console.log('\nInterakcije')
{
  const context = await fresh()
  const page = await context.newPage()
  const messages = []
  record(page, messages)
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load', timeout: 90000 })
  await sleep(2600)

  await page
    .locator('button[aria-label^="Brzi pregled"]')
    .first()
    .evaluate((node) => node.click())
  await sleep(1400)
  await page.keyboard.press('Escape')
  await sleep(800)

  await page.locator('button', { hasText: 'Dodaj u korpu' }).first().click()
  await sleep(1600)
  await page.locator('button[aria-label="Zatvori korpu"]').first().click()
  await sleep(800)

  await page
    .locator('button', { hasText: /^Odeća$/ })
    .first()
    .click()
  await sleep(1200)
  report('prodavnica: brzi pregled, korpa, filter', messages)
  await context.close()
}

{
  const context = await fresh(390, 844)
  const page = await context.newPage()
  const messages = []
  record(page, messages)
  await page.goto(`${BASE}/prijava`, { waitUntil: 'load', timeout: 90000 })
  await sleep(2800)

  await page.locator('button', { hasText: 'Nestao mi je pas' }).first().click()
  await sleep(500)
  await page
    .locator('button', { hasText: /^Dalje/ })
    .first()
    .click()
  await sleep(900)
  await page.locator('#report-location').fill('Zemun, kod pijace')
  await page
    .locator('button', { hasText: /^Dalje/ })
    .first()
    .click()
  await sleep(900)
  report('prijava: kroz korake', messages)
  await context.close()
}

{
  const context = await fresh(390, 844)
  const page = await context.newPage()
  const messages = []
  record(page, messages)
  await page.goto(`${BASE}/psi`, { waitUntil: 'load', timeout: 90000 })
  await sleep(2600)
  await page.locator('button[aria-controls="mobile-menu"]').click()
  await sleep(900)
  await page.keyboard.press('Escape')
  await sleep(800)
  report('telefon: meni', messages)
  await context.close()
}

// The theme swap re-runs every token and every component that reads one.
{
  const context = await fresh()
  const page = await context.newPage()
  const messages = []
  record(page, messages)
  await page.goto(`${BASE}/psi/mrvica`, { waitUntil: 'load', timeout: 90000 })
  await sleep(2600)
  await page.locator('button[aria-label*="tem"]').first().click()
  await sleep(1400)
  report('tema: prebacivanje', messages)
  await context.close()
}

await browser.close()

if (failed > 0) {
  console.error(`\ncheck-dev-console: ${failed} provera sa porukama u konzoli.`)
  process.exit(1)
}
console.log('\ncheck-dev-console: konzola je čista.')
