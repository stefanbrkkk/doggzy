#!/usr/bin/env node
import { chromium } from 'playwright'
import { resolveChromium } from './chromium-path.mjs'
import { setTimeout as sleep } from 'node:timers/promises'

/**
 * End-to-end suite.
 *
 * Deliberately a plain script rather than a test-runner dependency: it needs to
 * run identically in CI and in a sandbox, and the whole surface fits in one
 * file. Assumes a production server is already listening on BASE_URL.
 *
 *   npm run build && npm run start &   # then
 *   npm run test:e2e
 */

const BASE = process.env.E2E_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`

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

/** Console noise that is expected and not a defect. */
const IGNORED_CONSOLE = [/Download the React DevTools/i, /\[Fast Refresh\]/i]

let passed = 0
const failures = []

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1
    console.log(`  ok   ${name}`)
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function group(title, fn) {
  console.log(`\n${title}`)
  try {
    await fn()
  } catch (error) {
    failures.push(`${title} threw: ${error.message}`)
    console.log(`  FAIL ${title} threw — ${error.message}`)
  }
}

/**
 * Clears the persisted cart and favourites.
 *
 * Groups share one browser context so that persistence itself can be tested,
 * which means any group asserting an exact count has to start from a known
 * state rather than inheriting whatever ran before it.
 */
async function resetStore(page) {
  await page.evaluate(() => {
    try {
      localStorage.removeItem('doggzy.shop.v1')
    } catch {}
  })
  await page.reload({ waitUntil: 'load' })
  await sleep(700)
}

/** Attaches error collectors and returns the accumulating array. */
function watch(page, label) {
  const errors = []
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const text = message.text()
    if (IGNORED_CONSOLE.some((pattern) => pattern.test(text))) return
    errors.push(`console: ${text}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? ''
    if (failure.includes('ERR_ABORTED')) return
    errors.push(`requestfailed: ${request.url()} ${failure}`)
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`)
  })
  return { label, errors }
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

const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
// The preloader is a first-visit curtain; skipping it keeps every test honest
// about what it is actually waiting for.
await context.addInitScript(() => {
  try {
    sessionStorage.setItem('doggzy.visited', '1')
  } catch {}
})

// ---------------------------------------------------------------- routes ---
await group('Rute: status, naslov, greške u konzoli', async () => {
  for (const route of ROUTES) {
    const page = await context.newPage()
    const watcher = watch(page, route)

    const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 30000 })
    await sleep(500)

    check(`${route} vraća 200`, response?.status() === 200, `status ${response?.status()}`)

    const h1Count = await page.locator('h1').count()
    check(`${route} ima tačno jedan <h1>`, h1Count === 1, `nađeno ${h1Count}`)

    const title = await page.title()
    check(`${route} ima <title>`, title.length > 5, title)

    const lang = await page.getAttribute('html', 'lang')
    check(`${route} ima lang="sr-Latn-RS"`, lang === 'sr-Latn-RS', String(lang))

    check(`${route} bez grešaka u konzoli`, watcher.errors.length === 0, watcher.errors.join(' | '))

    await page.close()
  }
})

// ------------------------------------------------------------ no overflow ---
await group('Bez horizontalnog prelivanja na 390px', async () => {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })
  await mobile.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })

  for (const route of ROUTES) {
    const page = await mobile.newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 30000 })
    await sleep(350)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    check(`${route} se ne preliva`, overflow <= 1, `${overflow}px viška`)
    await page.close()
  }
  await mobile.close()
})

// ------------------------------------------------------------ report flow ---
await group('Prijava psa: ceo tok do potvrde', async () => {
  const page = await context.newPage()
  const watcher = watch(page, '/prijava')
  await page.goto(`${BASE}/prijava`, { waitUntil: 'load' })
  await sleep(600)

  const phone = page.locator('[aria-label="Prijava psa"]').first()

  await phone.getByRole('button', { name: /Nestao mi je pas/ }).click()
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(400)

  await page.locator('#report-location').fill('Vračar, Njegoševa 12')
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(400)

  await phone.getByRole('button', { name: 'Srednji', exact: true }).click()
  await phone.getByRole('button', { name: 'Crn', exact: true }).click()
  await page.locator('#report-description').fill('Crn mešanac, crvena ogrlica, plah prema ljudima.')
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(400)

  await page.locator('#report-name').fill('Milan')
  await page.locator('#report-contact').fill('060 1234567')
  await phone.getByRole('button', { name: 'Pošalji prijavu' }).click()
  await sleep(2000)

  const confirmed = await page.getByText('Prijava je primljena').isVisible()
  check('prijava stiže do potvrde', confirmed)

  const reference = await page.locator('text=/DG-\\d{4}-[A-Z0-9]{4}/').count()
  check('potvrda sadrži broj prijave', reference > 0)

  check('tok bez grešaka', watcher.errors.length === 0, watcher.errors.join(' | '))
  await page.close()
})

await group('Prijava psa: validacija zaustavlja prazan korak', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prijava`, { waitUntil: 'load' })
  await sleep(500)

  const phone = page.locator('[aria-label="Prijava psa"]').first()
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(300)

  const error = await page.getByText('Izaberi jednu opciju.').isVisible()
  check('bez izbora tipa prijave javlja grešku', error)

  const stillOnStepOne = await phone.getByText('Šta se dešava?', { exact: true }).isVisible()
  check('ostaje na prvom koraku', stillOnStepOne)
  await page.close()
})

// -------------------------------------------------------------------- shop ---
await group('Prodavnica: filtriranje, pretraga, korpa', async () => {
  const page = await context.newPage()
  const watcher = watch(page, '/prodavnica')
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(700)
  await resetStore(page)

  const initial = await page.locator('article').count()
  check('mreža prikazuje sve proizvode', initial === 12, `prikazano ${initial}`)

  await page.getByRole('button', { name: 'Igračke', exact: true }).click()
  await sleep(900)
  const toys = await page.locator('article').count()
  check('filter po kategoriji smanjuje listu', toys === 2, `prikazano ${toys}`)

  await page.getByRole('button', { name: 'Sve', exact: true }).click()
  await sleep(500)

  await page.locator('#shop-search').fill('ogrlica')
  await sleep(700)
  const searched = await page.locator('article').count()
  check('pretraga filtrira', searched === 1, `prikazano ${searched}`)

  await page.locator('#shop-search').fill('qqqqqq')
  await sleep(700)
  const empty = await page.getByText('Ništa ne odgovara pretrazi').isVisible()
  check('prazno stanje se prikazuje', empty)

  await page.getByRole('button', { name: 'Poništi filtere' }).first().click()
  await sleep(600)

  await page.locator('article').first().getByRole('button', { name: 'Dodaj u korpu' }).click()
  await sleep(900)

  const drawerOpen = await page.getByRole('dialog', { name: 'Korpa' }).isVisible()
  check('korpa se otvara posle dodavanja', drawerOpen)

  const badge = await page.getByRole('button', { name: /Korpa, 1 stavka/ }).count()
  check('bedž u zaglavlju se ažurira', badge > 0)

  await page.getByRole('button', { name: 'Zatvori korpu' }).first().click()
  await sleep(500)

  // Persistence across a reload is the whole point of the store.
  await page.reload({ waitUntil: 'load' })
  await sleep(900)
  const persisted = await page.getByRole('button', { name: /Korpa, 1 stavka/ }).count()
  check('korpa preživi osvežavanje', persisted > 0)

  check('prodavnica bez grešaka', watcher.errors.length === 0, watcher.errors.join(' | '))
  await page.close()
})

await group('Brzi pregled: otvaranje, kupovina, zatvaranje', async () => {
  const page = await context.newPage()
  const watcher = watch(page, '/prodavnica')
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(900)
  await resetStore(page)
  await sleep(400)

  const trigger = page.getByRole('button', { name: /Brzi pregled/ }).first()
  await trigger.scrollIntoViewIfNeeded()
  // Lenis eases scroll over about a second; clicking before it settles targets
  // a box that has already moved.
  await sleep(1600)
  await trigger.click()
  await sleep(1200)

  const dialog = page.getByRole('dialog', { name: /Brzi pregled/ })
  check('brzi pregled se otvara', await dialog.isVisible())

  // Escape must close it and hand focus back to the trigger.
  await page.keyboard.press('Escape')
  await sleep(800)
  check('Escape zatvara brzi pregled', (await dialog.count()) === 0)

  await trigger.click()
  await sleep(1200)
  await dialog.getByRole('button', { name: 'Dodaj u korpu' }).click()
  await sleep(1400)

  check(
    'kupovina iz brzog pregleda otvara korpu',
    await page.getByRole('dialog', { name: 'Korpa' }).isVisible(),
  )
  check(
    'bedž se ažurira',
    (await page.getByRole('button', { name: /Korpa, 1 stavka/ }).count()) > 0,
  )
  check('brzi pregled je zatvoren', (await dialog.count()) === 0)

  await page.getByRole('button', { name: 'Zatvori korpu' }).first().click()
  await sleep(600)
  check('brzi pregled bez grešaka', watcher.errors.length === 0, watcher.errors.join(' | '))
  await page.close()
})

await group('Korpa: izmena količine i praznjenje', async () => {
  const page = await context.newPage()

  // Start from exactly one known line so the quantity assertion is absolute.
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(800)
  await resetStore(page)
  await page.locator('article').first().getByRole('button', { name: 'Dodaj u korpu' }).click()
  await sleep(900)
  await page.getByRole('button', { name: 'Zatvori korpu' }).first().click()
  await sleep(500)

  await page.goto(`${BASE}/korpa`, { waitUntil: 'load' })
  await sleep(900)

  const hasItem = await page.locator('main li').count()
  check('korpa sadrži dodatu stavku', hasItem > 0)

  await page
    .getByRole('button', { name: /Povećaj količinu/ })
    .first()
    .click()
  await sleep(500)
  const quantity = await page.locator('main [aria-live="polite"]').first().textContent()
  check('količina se povećava', quantity?.trim() === '2', String(quantity))

  await page.getByRole('button', { name: 'Isprazni korpu' }).click()
  await sleep(700)
  const emptied = await page.getByText('Korpa je prazna').isVisible()
  check('korpa se prazni', emptied)
  await page.close()
})

await group('Omiljeno: čuvanje između stranica', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(800)

  await page
    .getByRole('button', { name: /Dodaj .* u omiljene/ })
    .first()
    .click()
  await sleep(600)

  await page.goto(`${BASE}/omiljeno`, { waitUntil: 'load' })
  await sleep(900)
  const saved = await page.locator('article').count()
  check('omiljeni proizvod se pojavljuje na stranici', saved === 1, `prikazano ${saved}`)
  await page.close()
})

// ------------------------------------------------------------------- theme ---
await group('Tema: prebacivanje i pamćenje', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(700)

  const before = await page.getAttribute('html', 'class')
  check('podrazumevana tema je tamna', before?.includes('dark') === true, String(before))

  await page.getByRole('button', { name: 'Uključi svetlu temu' }).first().click()
  await sleep(600)
  const after = await page.getAttribute('html', 'class')
  check('prelazi na svetlu temu', after?.includes('light') === true, String(after))

  await page.reload({ waitUntil: 'load' })
  await sleep(700)
  const remembered = await page.getAttribute('html', 'class')
  check('tema se pamti', remembered?.includes('light') === true, String(remembered))

  await page.getByRole('button', { name: 'Uključi tamnu temu' }).first().click()
  await sleep(400)
  await page.close()
})

// -------------------------------------------------------------- navigation ---
await group('Navigacija: mobilni meni i unutrašnji linkovi', async () => {
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true })
  await mobile.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  const page = await mobile.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(700)

  await page.getByRole('button', { name: 'Otvori meni' }).click()
  await sleep(500)
  const menuVisible = await page.locator('#mobile-menu').isVisible()
  check('mobilni meni se otvara', menuVisible)

  await page
    .getByRole('link', { name: /Prijavi psa/ })
    .first()
    .click()
  await page.waitForURL('**/prijava', { timeout: 10000 })
  check('link iz menija vodi na prijavu', page.url().endsWith('/prijava'))

  await page.close()
  await mobile.close()
})

await group('Svi unutrašnji linkovi vode na postojeće stranice', async () => {
  const page = await context.newPage()
  const seen = new Set()

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
    const hrefs = await page.$$eval('a[href^="/"]', (links) =>
      links.map((link) => link.getAttribute('href')),
    )
    for (const href of hrefs) {
      if (href && !href.startsWith('//') && !href.startsWith('/#')) seen.add(href.split('#')[0])
    }
  }

  const broken = []
  for (const href of seen) {
    const response = await page.request.get(`${BASE}${href}`)
    if (response.status() >= 400 && response.status() !== 307)
      broken.push(`${href} → ${response.status()}`)
  }
  check(`nema pokvarenih linkova (${seen.size} provereno)`, broken.length === 0, broken.join(', '))
  await page.close()
})

// ------------------------------------------------------------------- admin ---
await group('Admin: zaštita i odbijanje pogrešnih podataka', async () => {
  const page = await context.newPage()

  const response = await page.goto(`${BASE}/admin`, { waitUntil: 'load' })
  check('/admin preusmerava na prijavu', page.url().includes('/admin/login'), page.url())
  check('preusmerenje se završava sa 200', response?.status() === 200)

  const api = await page.request.get(`${BASE}/api/admin/me`)
  check('/api/admin/me odbija bez sesije', api.status() === 401, `status ${api.status()}`)

  const login = await page.request.post(`${BASE}/api/admin/login`, {
    data: { email: 'napadac@example.com', password: 'pogresno' },
    failOnStatusCode: false,
  })
  check(
    'prijava sa pogrešnim podacima ne uspeva',
    // 429 counts: the limiter refusing to even try is still a refusal, and a
    // suite run against a long-lived server legitimately reaches it.
    [401, 429, 503].includes(login.status()),
    `status ${login.status()}`,
  )

  await page.close()
})

await group('Admin: uspešna prijava, sesija i odjava', async () => {
  const page = await context.newPage()

  // Only meaningful where credentials are configured; elsewhere the negative
  // path above is the whole contract.
  const health = await page.request.get(`${BASE}/api/health`)
  const { config } = await health.json()
  const email = process.env.ADMIN_EMAIL
  const password = process.env.E2E_ADMIN_PASSWORD

  if (!config.adminAuth || !email || !password) {
    console.log('  --   preskočeno (ADMIN_EMAIL / E2E_ADMIN_PASSWORD nisu postavljeni)')
    await page.close()
    return
  }

  // The login limiter is per-process and holds for 15 minutes, so a suite run
  // against a long-lived server can legitimately hit it. That is correct
  // behaviour, not a failure — but it makes the positive path unverifiable, so
  // say so rather than reporting a false pass or a false fail.
  const probe = await page.request.post(`${BASE}/api/admin/login`, {
    data: { email, password: 'probe-nevalidna-lozinka' },
    failOnStatusCode: false,
  })
  if (probe.status() === 429) {
    console.log(
      '  --   preskočeno (ograničenje pokušaja je aktivno; pokreni protiv svežeg servera)',
    )
    await page.close()
    return
  }

  await page.goto(`${BASE}/admin/login`, { waitUntil: 'load' })
  await sleep(500)

  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill('sigurno-pogresna-lozinka')
  await page.getByRole('button', { name: 'Prijavi se' }).click()
  await sleep(1800)
  // Either message counts: the contract is that a bad password never gets in,
  // and after enough attempts the rate limiter answers instead.
  const rejected =
    (await page.getByText('Pogrešan email ili lozinka.').count()) +
    (await page.getByText('Previše pokušaja.', { exact: false }).count())
  check('pogrešna lozinka prikazuje poruku', rejected > 0)
  check('pogrešna lozinka ne pušta dalje', page.url().includes('/admin/login'))

  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'Prijavi se' }).click()
  await page.waitForURL('**/admin', { timeout: 15000 })
  await sleep(1200)
  check('tačna lozinka vodi na kontrolnu tablu', page.url().endsWith('/admin'))
  check('kontrolna tabla se prikazuje', await page.getByText('Pregled sadržaja').isVisible())

  const me = await page.request.get(`${BASE}/api/admin/me`)
  check('sesija važi za API', me.status() === 200, `status ${me.status()}`)

  await page.getByRole('button', { name: 'Odjavi se' }).click()
  await page.waitForURL('**/admin/login', { timeout: 15000 })
  check('odjava vraća na prijavu', page.url().includes('/admin/login'))

  const afterLogout = await page.request.get(`${BASE}/api/admin/me`)
  check('sesija više ne važi', afterLogout.status() === 401, `status ${afterLogout.status()}`)

  await page.close()
})

// ------------------------------------------------------------- misc routes ---
await group('Strukturirani podaci su validan JSON-LD', async () => {
  const page = await context.newPage()

  const expected = {
    '/': ['Organization', 'WebSite'],
    '/prodavnica/gps-ogrlica': ['Product', 'BreadcrumbList'],
    '/price/cetrdeset-minuta': ['Article', 'BreadcrumbList'],
    '/psi/mrvica': ['Article', 'BreadcrumbList'],
  }

  for (const [route, types] of Object.entries(expected)) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
    await sleep(400)

    const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((node) => node.textContent ?? ''),
    )

    let parsed = []
    let parseError = null
    try {
      parsed = blocks.flatMap((block) => {
        const value = JSON.parse(block)
        return Array.isArray(value) ? value : [value]
      })
    } catch (error) {
      parseError = error.message
    }

    check(`${route}: JSON-LD se parsira`, parseError === null, String(parseError))

    const found = parsed.map((entry) => entry['@type'])
    for (const type of types) {
      check(`${route}: sadrži ${type}`, found.includes(type), `nađeno ${found.join(', ')}`)
    }
  }

  await page.close()
})

await group('404, sitemap, robots, health', async () => {
  const page = await context.newPage()

  const missing = await page.goto(`${BASE}/ova-stranica-ne-postoji`, { waitUntil: 'load' })
  check('nepoznata putanja vraća 404', missing?.status() === 404, `status ${missing?.status()}`)
  // isVisible() does not auto-wait, so give hydration a beat first.
  await sleep(600)
  check('404 stranica je na srpskom', await page.getByText('Ova stranica ne postoji').isVisible())

  const sitemap = await page.request.get(`${BASE}/sitemap.xml`)
  const sitemapBody = await sitemap.text()
  check('sitemap.xml se generiše', sitemap.status() === 200)
  check('sitemap sadrži stranice pasa', sitemapBody.includes('/psi/mrvica'))
  check('sitemap ne sadrži privatne rute', !sitemapBody.includes('/korpa'))

  const robots = await page.request.get(`${BASE}/robots.txt`)
  const robotsBody = await robots.text()
  check('robots.txt se generiše', robots.status() === 200)
  check('robots zabranjuje /admin', robotsBody.includes('/admin'))

  const health = await page.request.get(`${BASE}/api/health`)
  check('health endpoint odgovara', health.status() === 200)

  await page.close()
})

await group('Ceo sajt je na latinici (uključujući formatirane datume)', async () => {
  // The source-level check cannot see this: Intl renders Serbian month names in
  // Cyrillic unless the locale is pinned to sr-Latn-RS, so it has to be caught
  // in the rendered page.
  const page = await context.newPage()

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
    await sleep(400)
    const offending = await page.evaluate(() => {
      const found = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const text = node.textContent ?? ''
        if (/[\u0400-\u04FF]/.test(text)) found.push(text.trim().slice(0, 60))
        node = walker.nextNode()
      }
      return found
    })
    check(`${route} bez ćirilice`, offending.length === 0, offending.join(' | '))
  }

  await page.close()
})

await group('Zaključavanje skrola se uvek otključa', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(900)

  const overflow = () => page.evaluate(() => getComputedStyle(document.body).overflow)

  await page.locator('article').first().getByRole('button', { name: 'Dodaj u korpu' }).click()
  await sleep(900)
  check('korpa zaključava skrol', (await overflow()).includes('hidden'))

  await page.getByRole('button', { name: 'Zatvori korpu' }).first().click()
  await sleep(900)
  check('zatvaranje korpe otključava skrol', !(await overflow()).includes('hidden'))

  // Two overlapping locks: whichever closes last must restore, not the first.
  const trigger = page.getByRole('button', { name: /Brzi pregled/ }).first()
  await trigger.scrollIntoViewIfNeeded()
  await sleep(1500)
  await trigger.click()
  await sleep(900)
  await page.keyboard.press('Escape')
  await sleep(900)
  check('zatvaranje brzog pregleda otključava skrol', !(await overflow()).includes('hidden'))

  const scrolled = await page.evaluate(() => {
    window.scrollBy(0, 400)
    return window.scrollY
  })
  check('stranica se i dalje skroluje', scrolled > 0, `scrollY ${scrolled}`)
  await page.close()
})

await group('Smanjene animacije: sajt ostaje upotrebljiv', async () => {
  const reducedCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  await reducedCtx.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  const page = await reducedCtx.newPage()
  const watcher = watch(page, 'reduced')

  for (const route of ['/', '/prodavnica', '/prijava', '/psi']) {
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
    await sleep(900)
    const visible = await page.locator('h1').first().isVisible()
    check(`${route} prikazuje naslov uz smanjene animacije`, visible)
  }

  // The report flow must still advance without its transitions.
  await page.goto(`${BASE}/prijava`, { waitUntil: 'load' })
  await sleep(800)
  const phone = page.locator('[aria-label="Prijava psa"]').first()
  await phone.getByRole('button', { name: /Nestao mi je pas/ }).click()
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(500)
  check(
    'prijava napreduje uz smanjene animacije',
    await page.locator('#report-location').isVisible(),
  )

  check(
    'bez grešaka uz smanjene animacije',
    watcher.errors.length === 0,
    watcher.errors.join(' | '),
  )
  await page.close()
  await reducedCtx.close()
})

await group('Prijava: greška slanja se poništava povratkom', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prijava`, { waitUntil: 'load' })
  await sleep(800)

  // Force the submit to fail so the error path is exercised for real.
  await page.route('**/api/prijava', (route) => route.fulfill({ status: 500, body: '{}' }))

  const phone = page.locator('[aria-label="Prijava psa"]').first()
  await phone.getByRole('button', { name: /Našao sam psa/ }).click()
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(400)
  await page.locator('#report-location').fill('Novi Beograd, blok 45')
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(400)
  await phone.getByRole('button', { name: 'Mali', exact: true }).click()
  await phone.getByRole('button', { name: 'Beo', exact: true }).click()
  await page.locator('#report-description').fill('Beo mešanac, mlad, bez ogrlice, prilazi ljudima.')
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(400)
  await page.locator('#report-name').fill('Ana')
  await page.locator('#report-contact').fill('ana@example.rs')
  await phone.getByRole('button', { name: 'Pošalji prijavu' }).click()
  await sleep(1500)

  check(
    'neuspelo slanje prikazuje grešku',
    await page.getByText('Slanje nije uspelo.', { exact: false }).isVisible(),
  )

  await phone.getByRole('button', { name: 'Nazad' }).click()
  await sleep(500)
  await phone.getByRole('button', { name: 'Dalje' }).click()
  await sleep(500)
  check(
    'povratak poništava staru grešku',
    (await page.getByText('Slanje nije uspelo.', { exact: false }).count()) === 0,
  )
  await page.close()
})

// ---------------------------------------------------------------- a11y ------
await group('Pristupačnost: preskoči na sadržaj, fokus, alt tekst', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(700)

  await page.keyboard.press('Tab')
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim())
  check('prvi Tab fokusira „Pređi na sadržaj”', focused === 'Pređi na sadržaj', String(focused))

  await page.keyboard.press('Enter')
  await sleep(400)
  check('preskakanje vodi na #sadrzaj', page.url().includes('#sadrzaj'), page.url())

  const unlabelled = await page.$$eval(
    'button:not([aria-label]):not([aria-labelledby])',
    (buttons) => buttons.filter((button) => !button.textContent?.trim()).length,
  )
  check('nema dugmadi bez pristupačnog imena', unlabelled === 0, `${unlabelled} bez imena`)

  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(700)
  const imagesWithoutLabel = await page.$$eval(
    'svg[role="img"]:not([aria-label]), img:not([alt])',
    (nodes) => nodes.length,
  )
  check('svaka ilustracija ima opis', imagesWithoutLabel === 0, `${imagesWithoutLabel} bez opisa`)

  await page.close()
})

// ------------------------------------------------- kvantitet i granice ------
await group('Količina se ne može podići iznad gornje granice', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica/poslastice-za-obuku`, { waitUntil: 'load' })
  await sleep(700)
  await resetStore(page)

  const plus = page.locator('button[aria-label^="Povećaj količinu"]').first()
  // Far past the 99 cap: the control must refuse rather than let the reducer
  // trim the value later and change the total by itself on the next load.
  for (let i = 0; i < 120; i += 1) {
    if (await plus.isDisabled()) break
    await plus.click()
  }

  const shown = Number(
    await page
      .locator('button[aria-label^="Povećaj količinu"]')
      .first()
      .locator('xpath=preceding-sibling::span[1]')
      .innerText(),
  )
  check('brojač staje na 99', shown === 99, String(shown))
  check('dugme „+” je onemogućeno na granici', await plus.isDisabled())

  await page.getByRole('button', { name: 'Dodaj u korpu' }).first().click()
  await sleep(600)
  const readTotal = () =>
    page
      .locator('dt', { hasText: /^Ukupno$/ })
      .first()
      .locator('xpath=following-sibling::dd[1]')
      .innerText()
  const totalBefore = await readTotal()

  await page.reload({ waitUntil: 'load' })
  await sleep(900)
  // The header retracts while scrolling down, and the browser restores the
  // previous scroll position on reload — put it back on screen first.
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(700)
  await page.locator('button[data-cart-target]').first().click()
  await sleep(600)
  const totalAfter = await readTotal()
  check(
    'ukupno se ne menja posle osvežavanja',
    totalBefore === totalAfter,
    `${totalBefore} → ${totalAfter}`,
  )

  await resetStore(page)
  await page.close()
})

// ------------------------------------------------------- telo zahteva -------
await group('Preveliki zahtevi se odbijaju pre učitavanja u memoriju', async () => {
  const oversized = await context.request.post(`${BASE}/api/kontakt`, {
    headers: { 'content-type': 'application/json' },
    data: JSON.stringify({
      name: 'A',
      email: 'a@b.rs',
      topic: 'opste',
      message: 'x'.repeat(200_000),
    }),
    failOnStatusCode: false,
  })
  check(
    '/api/kontakt odbija telo iznad granice sa 413',
    oversized.status() === 413,
    String(oversized.status()),
  )

  const ok = await context.request.post(`${BASE}/api/kontakt`, {
    headers: { 'content-type': 'application/json' },
    data: {
      name: 'A',
      email: 'a@b.rs',
      topic: 'opste',
      message: 'ne salji ovo, e2e provera granice',
    },
    failOnStatusCode: false,
  })
  check('normalan zahtev i dalje prolazi validaciju', ok.status() < 500, String(ok.status()))
})

// ------------------------------------------------------- bez skriptovanja ---
await group('Sajt je čitljiv i kada se skripte ne izvrše', async () => {
  const noScript = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    javaScriptEnabled: false,
  })
  const page = await noScript.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'load' })

  const heading = await page.locator('h1').first().innerText()
  check('naslov je serverski renderovan', heading.includes('Svaki dinar'), heading)

  // The curtain is server-rendered. Without JS nothing in React can retire it,
  // so the <noscript> rule has to.
  const curtainVisible = await page.evaluate(() => {
    const node = document.querySelector('[data-preloader]')
    if (!node) return false
    return getComputedStyle(node).display !== 'none'
  })
  check('zavesa se ne prikazuje bez skripti', curtainVisible === false)

  await noScript.close()
})

// -------------------------------------------------------- ulazna animacija --
await group('Hero čeka da se zavesa podigne', async () => {
  const fresh = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await fresh.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'commit' })

  const liftedGlyphs = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll('h1 span')].filter((node) => {
          const t = getComputedStyle(node).transform
          if (!t.startsWith('matrix(')) return false
          return Math.abs(Number(t.slice(7, -1).split(',')[5])) > 1
        }).length,
    )

  // While the curtain is up the headline glyphs are still under their mask.
  const early = await page.evaluate(async () => {
    const start = performance.now()
    while (performance.now() - start < 2000) {
      if (document.querySelector('[data-preloader]') && document.querySelector('h1 span'))
        return true
      await new Promise((resolve) => requestAnimationFrame(() => resolve()))
    }
    return false
  })
  check('zavesa se pojavljuje na prvoj poseti', early)

  const maskedDuring = await liftedGlyphs()
  check('naslov je još pod maskom dok zavesa stoji', maskedDuring > 0, `${maskedDuring} pomerenih`)

  await sleep(6000)
  const curtainGone = await page.evaluate(() => document.querySelector('[data-preloader]') === null)
  check('zavesa nestaje', curtainGone)

  const maskedAfter = await liftedGlyphs()
  check(
    'naslov je izašao iz maske posle zavese',
    maskedAfter === 0,
    `${maskedAfter} ostalo pomereno`,
  )

  await fresh.close()
})

// ------------------------------------------------- smanjene animacije: pozicija
await group('Smanjene animacije ne ostavljaju pomerene elemente', async () => {
  const reduced = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await reduced.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(600)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  // Lenis animates programmatic scrolls, and every reveal on the way down
  // starts as it arrives — wait for the page to actually come to rest.
  await page.evaluate(async () => {
    let last = -1
    while (last !== window.scrollY) {
      last = window.scrollY
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  })
  await sleep(1500)

  const stranded = await page.evaluate(
    () =>
      [...document.querySelectorAll('footer *, main *')].filter((node) => {
        const t = getComputedStyle(node).transform
        if (!t.startsWith('matrix(')) return false
        const parts = t.slice(7, -1).split(',').map(Number)
        // Only a leftover translate counts; scales and rotations are deliberate.
        return parts[0] === 1 && parts[3] === 1 && Math.abs(parts[5]) > 4
      }).length,
  )
  check(
    'nijedan element nije zaglavljen ispod svoje pozicije',
    stranded === 0,
    `${stranded} pomerenih`,
  )

  await reduced.close()
})

// ------------------------------------------------------ jedna traka napretka
await group('Napredak čitanja se ne dupla', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/price/cetrdeset-minuta`, { waitUntil: 'load' })
  await sleep(700)
  await page.evaluate(() => window.scrollTo(0, 1500))
  await sleep(600)

  const barsAtTop = await page.evaluate(
    () =>
      [...document.querySelectorAll('body *')].filter((node) => {
        const style = getComputedStyle(node)
        if (style.position !== 'fixed') return false
        const rect = node.getBoundingClientRect()
        return rect.top === 0 && rect.height > 0 && rect.height <= 4 && rect.width > 200
      }).length,
  )
  check('samo jedna traka stoji na vrhu', barsAtTop === 1, `${barsAtTop} traka`)

  await page.close()
})

await context.close()
await browser.close()

console.log(`\n${passed} provera prošlo, ${failures.length} palo.`)
if (failures.length > 0) {
  console.error('\nPale provere:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
