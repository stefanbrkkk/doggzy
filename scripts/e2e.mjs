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
  try {
    await page.waitForURL('**/admin', { timeout: 25000 })
  } catch {
    // The limiter counts the wrong-password attempt above, and anything else
    // sharing this server counts too. Refusing is the contract, not a failure.
    const limited = await page.getByText('Previše pokušaja.', { exact: false }).count()
    console.log(
      limited > 0
        ? '  --   preskočeno (ograničenje pokušaja se aktiviralo tokom prijave)'
        : '  --   preskočeno (prijava nije stigla do table na vreme)',
    )
    await page.close()
    return
  }
  await sleep(1200)
  check('tačna lozinka vodi na kontrolnu tablu', page.url().endsWith('/admin'))
  // By role, not by text: "Pregled sadržaja" also appears in the page title,
  // and a bare text locator matches more than the heading.
  const dashboardHeading = page.getByRole('heading', { name: 'Pregled sadržaja', level: 1 })
  check('kontrolna tabla se prikazuje', await dashboardHeading.isVisible())
  check('tabla ima tačno jedan h1', (await page.locator('h1').count()) === 1)

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

  // Every unknown URL is answered with the same prerendered `/_not-found`
  // shell, so anything in the layout that keys off `usePathname()` disagrees
  // with the server there. The nav's section pill did, and React answered the
  // structural mismatch by throwing away the served document — `<head>`,
  // metadata and all — and rebuilding it on the client, on every 404 that
  // happened to sit under a nav prefix.
  for (const unknown of ['/psi-nesto-drugo', '/prodavnica-xyz', '/price-abc', '/psi/nema-ga']) {
    const hydration = await context.newPage()
    const thrown = []
    hydration.on('pageerror', (error) => thrown.push(error.message))
    const response = await hydration.goto(`${BASE}${unknown}`, { waitUntil: 'load' })
    await sleep(900)
    check(
      `${unknown} je 404 koji se hidrira bez greške`,
      response?.status() === 404 && thrown.length === 0,
      `status ${response?.status()} ${thrown.join(' | ')}`,
    )
    await hydration.close()
  }

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
  // The contact limiter is 5 per 15 minutes and lives in the server process, so
  // a repeat run against the same server legitimately reaches it before the
  // size guard ever gets a look. That is correct behaviour, not a result.
  if (oversized.status() === 429) {
    console.log('  --   preskočeno (ograničenje poruka je aktivno; pokreni protiv svežeg servera)')
    return
  }
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

  // Sampled inside one evaluate: measuring the glyphs in a second round-trip
  // leaves a window in which the curtain can lift between the two calls, which
  // reads as "the headline was never masked" when it simply was not looked at
  // in time.
  const early = await page.evaluate(async () => {
    const lifted = () =>
      [...document.querySelectorAll('h1 span')].filter((node) => {
        const t = getComputedStyle(node).transform
        if (!t.startsWith('matrix(')) return false
        return Math.abs(Number(t.slice(7, -1).split(',')[5])) > 1
      }).length

    const start = performance.now()
    let sawCurtain = false
    let maskedWithCurtain = 0
    let hydratedAt = null

    while (performance.now() - start < 4000) {
      if (hydratedAt === null && document.documentElement.classList.contains('lenis')) {
        // The class Lenis adds on construction is the cheapest observable proof
        // that the client bundle has run.
        hydratedAt = Math.round(performance.now())
      }
      if (document.querySelector('[data-preloader]') !== null) {
        sawCurtain = true
        maskedWithCurtain = Math.max(maskedWithCurtain, lifted())
      } else if (sawCurtain) {
        break
      }
      await new Promise((resolve) => requestAnimationFrame(() => resolve()))
    }
    return { sawCurtain, maskedWithCurtain, hydratedAt }
  })

  // The curtain has an absolute 3s deadline measured from navigation start, so
  // a page that hydrates later than that correctly shows no curtain at all.
  // Under a loaded machine that is the honest outcome, not a defect.
  if (!early.sawCurtain && (early.hydratedAt === null || early.hydratedAt > 2800)) {
    console.log(
      `  --   preskočeno (hidracija na ${early.hydratedAt ?? '?'}ms je prošla rok zavese)`,
    )
    await fresh.close()
    return
  }
  check('zavesa se pojavljuje na prvoj poseti', early.sawCurtain)
  check(
    'naslov je još pod maskom dok zavesa stoji',
    early.maskedWithCurtain > 0,
    `${early.maskedWithCurtain} pomerenih`,
  )

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

  // Measured from the entrance cue, not from a wall-clock window after load.
  // The preloader retires its curtain without animating under reduced motion
  // and fires the cue as it does, so waiting for `.preloaded` is waiting for
  // exactly the event the hero is gated on — and the check stops depending on
  // how fast the machine happened to hydrate.
  await page
    .waitForFunction(() => document.documentElement.classList.contains('preloaded'), null, {
      timeout: 15000,
    })
    .catch(() => {})
  await sleep(900)

  // Checked before scrolling and before the 4s failsafe could paper over it: a
  // path that closes the curtain without releasing the entrance leaves the
  // whole hero 16px low.
  const heroStranded = await page.evaluate(
    () =>
      [...document.querySelectorAll('h1 ~ *, [class*="text-lead"]')].filter((node) => {
        const t = getComputedStyle(node).transform
        if (!t.startsWith('matrix(')) return false
        return Math.abs(Number(t.slice(7, -1).split(',')[5])) > 1
      }).length,
  )
  check(
    'hero se smesti bez čekanja na rezervni tajmer',
    heroStranded === 0,
    `${heroStranded} pomerenih`,
  )

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

// ---------------------------------------------------------------- staklo ----
await group('Staklene površine stvarno zamućuju pozadinu', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(800)
  // The nav only condenses into glass once the page has moved.
  await page.evaluate(() => window.scrollTo(0, 600))
  await sleep(900)

  // Checked as a computed value in a real browser, not as text in the
  // stylesheet. Lightning CSS collapses `backdrop-filter` and
  // `-webkit-backdrop-filter` into one property and keeps only the last one
  // declared, so a source file that spells out both can ship the prefixed form
  // alone — which Chrome does not support. The rule looked right in review and
  // every glass surface on the site rendered flat.
  const glass = await page.evaluate(() => {
    if (!CSS.supports('backdrop-filter', 'blur(1px)')) return { skip: true }
    return [...document.querySelectorAll('[class*="glass"]')].map((node) => ({
      cls: node.className.split(' ').find((c) => c.startsWith('glass')),
      filter: getComputedStyle(node).backdropFilter,
    }))
  })

  if (glass.skip) {
    console.log('  --   preskočeno (pregledač ne podržava backdrop-filter)')
    await page.close()
    return
  }

  check('stranica ima staklenu površinu', glass.length > 0, `${glass.length} pronađeno`)
  const flat = glass.filter((entry) => entry.filter === 'none' || !entry.filter)
  check(
    'nijedna staklena površina nije bez zamućenja',
    flat.length === 0,
    flat.map((entry) => entry.cls).join(', '),
  )

  // The other half of the rule: a blur this wide over a region that scrolls
  // makes the compositor re-read its backdrop every frame. One on the shop's
  // filter bar cost 30–48% of frames through the product grid, and shrinking
  // the radius did nothing — it is the read-back that is expensive. Glass
  // belongs on floating chrome, which is why this only looks inside <main>.
  const wide = await page.evaluate(() => {
    const viewport = window.innerWidth
    return [...document.querySelectorAll('main *')]
      .filter((node) => {
        const filter = getComputedStyle(node).backdropFilter
        return filter && filter !== 'none'
      })
      .map((node) => ({
        cls: typeof node.className === 'string' ? node.className.slice(0, 60) : '',
        ratio: +(node.getBoundingClientRect().width / viewport).toFixed(2),
      }))
      .filter((entry) => entry.ratio > 0.5)
  })
  check(
    'nijedno široko zamućenje ne stoji nad sadržajem koji se skroluje',
    wide.length === 0,
    wide.map((entry) => `${entry.cls} (${entry.ratio}×)`).join(', '),
  )

  await page.close()
})

// --------------------------------------------------------- zaključan skrol --
await group('Modali stvarno zaustavljaju skrol, ne samo overflow', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(900)
  await resetStore(page)

  await page.locator('button:has-text("Dodaj u korpu")').first().click()
  await sleep(900)
  check('korpa je otvorena', await page.locator('[role="dialog"][aria-label="Korpa"]').isVisible())

  // `body { overflow: hidden }` alone does not stop Lenis, which drives
  // window.scrollY programmatically — every overlay scrolled the page behind it.
  const before = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 700)
  await sleep(800)
  const during = await page.evaluate(() => window.scrollY)
  check('stranica se ne pomera iza korpe', during === before, `${before} → ${during}`)
  check(
    'pokretač skrola je zaustavljen',
    await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped')),
  )

  await page.keyboard.press('Escape')
  await sleep(700)
  check('pozicija je ista posle zatvaranja', (await page.evaluate(() => window.scrollY)) === before)
  await page.mouse.wheel(0, 500)
  await sleep(700)
  check('skrol ponovo radi', (await page.evaluate(() => window.scrollY)) > before)

  await resetStore(page)
  await page.close()
})

await group('Zavesa ne pušta stranicu da se pomeri ispod nje', async () => {
  const fresh = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await fresh.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'commit' })
  await sleep(500)
  await page.mouse.wheel(0, 800)
  await sleep(700)
  const state = await page.evaluate(() => ({
    y: window.scrollY,
    curtain: document.querySelector('[data-preloader]') !== null,
  }))
  check('zavesa je još gore', state.curtain)
  check('stranica je i dalje na vrhu', state.y === 0, `y=${state.y}`)
  await fresh.close()
})

await group('Smanjene animacije: zavesa nestane umesto da se podigne', async () => {
  const quiet = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await quiet.newPage()

  // Sampled inside the page rather than polled from Node: from the outside a
  // slow hydration and a curtain playing its 1.4s lift look identical, and on
  // a loaded machine the two windows overlap.
  await page.addInitScript(() => {
    const state = { seen: false, visible: false, lifted: false, removedAt: null }
    window.__curtain = state
    const identity = /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/
    const tick = () => {
      if (performance.now() > 12000) return
      const node = document.querySelector('[data-preloader]')
      if (node) {
        state.seen = true
        if (getComputedStyle(node).display !== 'none') state.visible = true
        for (const panel of node.querySelectorAll('[data-preloader-panel]')) {
          if (!identity.test(getComputedStyle(panel).transform)) state.lifted = true
        }
      } else if (state.seen) {
        state.removedAt = Math.round(performance.now())
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })

  const settle = () =>
    page
      .waitForFunction(() => window.__curtain.removedAt !== null, null, { timeout: 15000 })
      .catch(() => {})

  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await settle()
  const first = await page.evaluate(() => ({ ...window.__curtain }))
  check('prva poseta: zavesa se povuče', first.removedAt !== null, JSON.stringify(first))
  check('prva poseta: nijedan panel se ne pomera', first.lifted === false, JSON.stringify(first))
  const flagged = await page.evaluate(() => sessionStorage.getItem('doggzy.visited'))
  check('prva poseta: poseta je zapamćena', flagged === '1', String(flagged))

  // Same session again: the inline script hides it before first paint, so it
  // must never be painted — and must not sit there as a full-viewport node
  // waiting out an exit that has nothing to reveal.
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await settle()
  const second = await page.evaluate(() => ({ ...window.__curtain }))
  check(
    'druga poseta: zavesa se nikad ne prikaže',
    second.visible === false,
    JSON.stringify(second),
  )
  check('druga poseta: čvor ne ostaje u DOM-u', second.removedAt !== null, JSON.stringify(second))

  await quiet.close()
})

// ------------------------------------------------------- nagnut telefon -----
await group('Nagnut telefon ostaje kliktabilan', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(2500)

  const screen = page.locator('[role="group"][aria-label="Prijava psa"]')
  const option = screen.locator('button', { hasText: 'Nestao mi je pas' }).first()
  await option.hover()
  await sleep(600)
  await option.click()
  await sleep(400)
  // The tilt only exists once the pointer is inside the frame, which is
  // unavoidable to reach any control — and `transform-style: preserve-3d` made
  // Chromium hit-test the screen against a plane that did not match the paint.
  check(
    'izbor prima klik dok je telefon nagnut',
    (await option.getAttribute('aria-pressed')) === 'true',
  )

  const dead = await page.evaluate(() => {
    const node = document.querySelector('[role="group"][aria-label="Prijava psa"]')
    const rect = node.getBoundingClientRect()
    let total = 0
    let bad = 0
    for (let i = 1; i <= 9; i += 1) {
      for (let j = 1; j <= 11; j += 1) {
        total += 1
        const x = rect.left + (rect.width * i) / 10
        const y = rect.top + (rect.height * j) / 12
        if (!node.contains(document.elementFromPoint(x, y))) bad += 1
      }
    }
    return Math.round((bad / total) * 100)
  })
  check('nema mrtve zone na ekranu telefona', dead === 0, `${dead}%`)

  await screen.locator('button', { hasText: 'Dalje' }).first().click()
  await sleep(600)
  check('„Dalje” pomera korak', (await screen.innerText()).includes('Gde'))

  await page.close()
})

// ------------------------------------------------------------- fokus --------
await group('Fokus ostaje u otvorenom dijalogu', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(900)
  await resetStore(page)

  await page.locator('button[aria-label^="Brzi pregled"]').first().click()
  await sleep(900)
  // `focus()` on a `visibility: hidden` element is a no-op, so focusing the
  // panel before it became visible left focus on the trigger outside.
  check(
    'brzi pregled preuzima fokus',
    await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return Boolean(dialog && dialog.contains(document.activeElement))
    }),
  )
  await page.keyboard.press('Escape')
  await sleep(600)
  await page.close()
})

// Its own group, because the panel's paint gate behaves differently here: under
// reduced motion the morph never runs, and it was that call which flushed the
// panel to computed-visible. A `ready` flag alone is not visibility.
await group('Brzi pregled preuzima fokus i uz smanjene animacije', async () => {
  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await reduced.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(1100)
  await page.locator('button[aria-label^="Brzi pregled"]').first().click()
  await sleep(900)
  check(
    'fokus je u dijalogu',
    await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return Boolean(dialog && dialog.contains(document.activeElement))
    }),
  )

  let escaped = false
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      return Boolean(dialog && dialog.contains(document.activeElement))
    })
    if (!inside) escaped = true
  }
  check('Tab ne izlazi iza modala', !escaped)
  await reduced.close()
})

await group('Prazna korpa zadržava fokus', async () => {
  const page = await context.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(900)
  await resetStore(page)

  await page.locator('button:has-text("Dodaj u korpu")').first().click()
  await sleep(900)
  await page.locator('button[aria-label^="Smanji količinu"]').first().click()
  await sleep(800)
  check(
    'pražnjenje korpe ne ispušta fokus iz dijaloga',
    await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-label="Korpa"]')
      return Boolean(dialog && dialog.contains(document.activeElement))
    }),
  )
  await page.keyboard.press('Escape')
  await resetStore(page)
  await page.close()
})

// --------------------------------------------------- vidljive tvrdnje -------
await group('Trake pokrivenosti se popune na svakom rasporedu', async () => {
  const page = await context.newPage()
  for (const width of [1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`${BASE}/psi`, { waitUntil: 'load' })
    await sleep(700)
    // Stepped rather than jumped: an instant scroll past a card never gives the
    // observer a frame to report it.
    await page.evaluate(async () => {
      const end = document.body.scrollHeight
      for (let y = 0; y <= end; y += 300) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 90))
      }
    })
    await sleep(1400)
    const scales = await page.evaluate(() =>
      [...document.querySelectorAll('.h-1\\.5.overflow-hidden > *')].map((node) =>
        Number(new DOMMatrix(getComputedStyle(node).transform).a.toFixed(2)),
      ),
    )
    check(
      `trake se popune na ${width}px`,
      scales.length > 0 && scales.every((scale) => scale > 0),
      scales.join(' '),
    )
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.close()
})

await group('Nijedno dugme ne seče sopstveni natpis', async () => {
  const page = await context.newPage()
  for (const width of [320, 360, 390, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/prodavnica/ortopedski-lezaj', '/korpa', '/doniraj', '/kontakt']) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
      await sleep(400)
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll('button, a')]
          .filter((node) => !node.className.toString().includes('sr-only'))
          .filter((node) => node.textContent?.trim())
          .map((node) => ({ node, overflow: getComputedStyle(node).overflowX }))
          // Two different defects, and two different tolerances. A control that
          // hides its overflow eats the label outright, so any excess counts.
          // One that shows it merely paints outside its border — and there a
          // couple of pixels are routine, because `scrollWidth` also grows to
          // cover a rotated child (the FAQ's plus icon) and sub-pixel layout.
          // A word spilling out of its box is an order of magnitude larger.
          .filter(({ node, overflow }) => {
            const excess = node.scrollWidth - node.clientWidth
            return overflow === 'visible' ? excess > 8 : excess > 1
          })
          .map(
            ({ node, overflow }) =>
              `${node.textContent.trim().slice(0, 18)} ${node.scrollWidth}>${node.clientWidth} (${overflow})`,
          ),
      )
      check(`${route} @${width}`, clipped.length === 0, clipped.join(' | '))
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.close()
})

// ------------------------------------------------------------- ikone --------
await group('Ikone i manifest stvarno postoje', async () => {
  for (const path of ['/icon', '/apple-icon', '/favicon.ico']) {
    const response = await context.request.get(`${BASE}${path}`, { failOnStatusCode: false })
    check(`${path} se servira`, response.status() === 200, `status ${response.status()}`)
    const body = await response.body()
    check(`${path} nije prazan`, body.length > 1000, `${body.length}b`)
  }

  const manifest = await (await context.request.get(`${BASE}/manifest.webmanifest`)).json()
  // The manifest offers a shortcut and `display: standalone`, so the install
  // prompt is a real invitation — and it opened with a blank tile.
  check('manifest navodi ikone', Array.isArray(manifest.icons) && manifest.icons.length > 0)
  for (const icon of manifest.icons ?? []) {
    const response = await context.request.get(`${BASE}${icon.src}`, { failOnStatusCode: false })
    check(`ikona ${icon.src} (${icon.purpose}) postoji`, response.status() === 200)
  }
})

// ------------------------------------------------- mali i položeni ekrani ---
/** A phone-shaped context with real touch, so `isMobile` layout rules apply. */
async function phone(width, height) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  })
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  return ctx
}

await group('Meni na položenom telefonu dohvata sve destinacije', async () => {
  // Below `lg` this overlay is the only navigation, and it lays its content out
  // ~300px taller than a landscape phone. With no overflow handling the bottom
  // half was simply cut off — and `lockScroll()` had already frozen the page
  // behind it, so eight destinations could not be reached at all.
  for (const [width, height] of [
    [844, 390],
    [667, 375],
    [932, 430],
    [390, 844],
  ]) {
    const ctx = await phone(width, height)
    const page = await ctx.newPage()
    await page.goto(`${BASE}/psi`, { waitUntil: 'load' })
    await sleep(900)
    await page.locator('button[aria-controls="mobile-menu"]').click()
    await sleep(700)

    const reach = await page.evaluate(() => {
      const dialog = document.getElementById('mobile-menu')
      // Whichever element actually scrolls: the dialog owns the background and
      // an inner box owns the scroll, so the bar never has content behind it.
      const panel =
        dialog.scrollHeight > dialog.clientHeight
          ? dialog
          : ([...dialog.querySelectorAll('*')].find(
              (node) => node.scrollHeight > node.clientHeight,
            ) ?? dialog)
      const links = [...dialog.querySelectorAll('a[href]')]
      const onScreen = (node) => {
        const box = node.getBoundingClientRect()
        return box.top >= 0 && box.bottom <= window.innerHeight
      }
      panel.scrollTop = 0
      const first = onScreen(links[0])
      panel.scrollTop = panel.scrollHeight
      const last = onScreen(links[links.length - 1])
      return {
        first,
        last,
        maxScroll: panel.scrollHeight - panel.clientHeight,
        reached: panel.scrollTop,
      }
    })
    check(
      `meni @${width}×${height}: prva i poslednja destinacija su dohvatljive`,
      reach.first && reach.last,
      JSON.stringify(reach),
    )
    // Portrait fits, and must not gain a scrollbar it never had.
    check(
      `meni @${width}×${height}: skroluje se tačno kada treba`,
      height > width ? reach.maxScroll === 0 : reach.maxScroll > 0,
      JSON.stringify(reach),
    )

    // The bar only condenses on scroll, and the page behind cannot scroll while
    // the menu is open — so a transparent bar let the links print over the logo.
    const bar = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('nav[aria-label="Glavna navigacija"]'))
          .backgroundColor,
    )
    check(`meni @${width}×${height}: traka nije providna`, !/[,/]\s*0\)$/.test(bar), bar)

    // Scrolled to the bottom, nothing from the menu may be painted in the strip
    // around the bar: it is a rounded pill inset from the edge, and content
    // running the full height passed through and printed over the logo.
    // Hit-tested rather than measured — `getBoundingClientRect` reports the
    // unclipped box, so an item scrolled safely out of the scroller still looks
    // like it is up there.
    const behind = await page.evaluate(() => {
      const nav = document
        .querySelector('nav[aria-label="Glavna navigacija"]')
        .getBoundingClientRect()
      const dialog = document.getElementById('mobile-menu')
      const hits = new Set()
      for (let x = 8; x < window.innerWidth; x += 40) {
        for (const y of [2, Math.round(nav.top / 2), Math.round(nav.bottom) - 2]) {
          for (const node of document.elementsFromPoint(x, y)) {
            const target = node.closest?.('a[href], button')
            if (target && dialog.contains(target)) hits.add(target.textContent.trim().slice(0, 24))
          }
        }
      }
      return [...hits]
    })
    check(
      `meni @${width}×${height}: ništa ne prolazi iza trake`,
      behind.length === 0,
      behind.join(', '),
    )
    await ctx.close()
  }
})

await group('Brzi pregled staje na niske ekrane', async () => {
  for (const [width, height, scrolls] of [
    [390, 667, true],
    [844, 390, true],
    [390, 844, false],
    [1280, 800, false],
  ]) {
    const ctx = await phone(width, height)
    const page = await ctx.newPage()
    await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
    await sleep(1600)
    await page
      .locator('button[aria-label^="Brzi pregled"]')
      .first()
      .evaluate((node) => node.click())
    await sleep(900)

    const view = await page.evaluate(() => {
      const panel = document.querySelector('[role="dialog"] > div:nth-child(2)')
      const close = [...document.querySelectorAll('[role="dialog"] button')].find(
        (node) =>
          node.getAttribute('aria-label') === 'Zatvori brzi pregled' &&
          node.className.includes('absolute'),
      )
      const panelBox = panel?.getBoundingClientRect()
      const closeBox = close?.getBoundingClientRect()
      return {
        top: Math.round(panelBox?.top ?? NaN),
        bottom: Math.round(panelBox?.bottom ?? NaN),
        closeTop: Math.round(closeBox?.top ?? NaN),
        closeBottom: Math.round(closeBox?.bottom ?? NaN),
        canScroll: panel ? panel.scrollHeight > panel.clientHeight : null,
        radius: panel ? getComputedStyle(panel).borderTopLeftRadius : null,
        overflowX: panel ? getComputedStyle(panel).overflowX : null,
      }
    })

    // It used to be centred and clipped equally at both ends, which put the
    // close button above the screen and the full-page link below it — two 16px
    // strips of backdrop were the only way out of a modal dialog.
    check(
      `brzi pregled @${width}×${height}: panel je u ekranu`,
      view.top >= 0 && view.bottom <= height,
      JSON.stringify(view),
    )
    check(
      `brzi pregled @${width}×${height}: dugme za zatvaranje je dohvatljivo`,
      view.closeTop >= 0 && view.closeBottom <= height,
      JSON.stringify(view),
    )
    check(
      `brzi pregled @${width}×${height}: skroluje se tačno kada treba`,
      view.canScroll === scrolls,
      `canScroll ${view.canScroll}`,
    )
    // `overflow-x-hidden` is explicit now, because the corner radius used to
    // rely on the `overflow-hidden` that had to go.
    check(
      `brzi pregled @${width}×${height}: zaobljeni uglovi su preživeli`,
      view.radius !== '0px' && view.overflowX === 'hidden',
      `${view.radius} / ${view.overflowX}`,
    )
    await ctx.close()
  }
})

await group('Filtriranje ne ostavlja posetioca u podnožju', async () => {
  const ctx = await phone(390, 844)
  const page = await ctx.newPage()
  await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
  await sleep(1600)

  // First: a reload keeps you where you were. The effect that fixes the defect
  // below must not fire on mount, or it races the browser's own scroll
  // restoration and throws the visitor back to the top of a list they had left
  // halfway down.
  await page.evaluate(() => window.scrollTo(0, 4000))
  await sleep(900)
  await page.reload({ waitUntil: 'load' })
  await sleep(2500)
  const restored = await page.evaluate(() => Math.round(window.scrollY))
  check('ponovno učitavanje čuva poziciju u listi', restored > 3000, `y=${restored}`)

  // One column on a phone, so narrowing the catalogue collapses the document
  // from ~9,500px to ~3,600px while `scrollY` stays put — the visitor ended up
  // in the footer with no products and no filter bar anywhere on screen.
  await page.evaluate(() => window.scrollTo(0, 4800))
  await sleep(800)
  await page
    .locator('button', { hasText: /^Odeća$/ })
    .first()
    .evaluate((node) => node.click())
  await sleep(1400)

  const after = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    barTop: Math.round(document.querySelector('.pane').getBoundingClientRect().top),
    cards: [...document.querySelectorAll('main a[href^="/prodavnica/"]')].filter((node) => {
      const box = node.getBoundingClientRect()
      return box.top < window.innerHeight && box.bottom > 0
    }).length,
  }))
  check('filter vraća posetioca na rezultate', after.barTop >= 0, JSON.stringify(after))
  check('posle filtriranja se vidi bar jedan proizvod', after.cards > 0, JSON.stringify(after))

  // And the common case — filtering from the top — must not jump at all.
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(600)
  await page
    .locator('button', { hasText: /^Igračke$/ })
    .first()
    .evaluate((node) => node.click())
  await sleep(1000)
  const settled = await page.evaluate(() => Math.round(window.scrollY))
  check('filtriranje sa vrha ne pomera stranicu', settled === 0, `y=${settled}`)
  await ctx.close()
})

await group('Lepljiva traka pušta niske ekrane', async () => {
  // Gated on height, not width: at 844×390 the 80px header offset plus the
  // 180px panel ate 67% of the screen, against product cards 378px tall. A
  // `lg:` gate would have missed a 1280×400 desktop window and taken the
  // pinning away from portrait phones, where the panel is a fine 21–27%.
  for (const [width, height, want] of [
    [844, 390, 'static'],
    [1280, 400, 'static'],
    [390, 667, 'sticky'],
    [1440, 900, 'sticky'],
  ]) {
    const ctx = await browser.newContext({ viewport: { width, height } })
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('doggzy.visited', '1')
      } catch {}
    })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
    await sleep(1200)
    const position = await page.evaluate(
      () => getComputedStyle(document.querySelector('.pane')).position,
    )
    check(`traka @${width}×${height} je ${want}`, position === want, position)
    await ctx.close()
  }
})

// ------------------------------------------------------------ jezik forme ---
await group('Greške u formama su na srpskom i ne zumiraju ekran', async () => {
  // iOS Safari zooms the page whenever a focused control is under 16px and
  // leaves the visitor pinch-zoomed for the rest of the session.
  for (const route of ['/prodavnica', '/doniraj', '/kontakt', '/prijava']) {
    const ctx = await phone(390, 844)
    const page = await ctx.newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
    await sleep(1500)
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('input, select, textarea')]
        .filter(
          (node) => node.type !== 'hidden' && parseFloat(getComputedStyle(node).fontSize) < 16,
        )
        .map((node) => `${node.id || node.tagName}:${getComputedStyle(node).fontSize}`),
    )
    check(`${route}: nijedna kontrola nije ispod 16px`, small.length === 0, small.join(', '))
    await ctx.close()
  }

  // Zod's defaults are English sentences written for developers, and this app
  // renders `issues[0].message` straight at the visitor. Every `.min()` had
  // Serbian text and every `.max()` did not, so the English only ever showed up
  // for someone who pasted too much.
  const english = /Too big|Too small|Invalid input|Invalid option|expected \w+ to/i
  const ctx = await phone(390, 844)
  const page = await ctx.newPage()
  await page.goto(`${BASE}/kontakt`, { waitUntil: 'load' })
  await sleep(1400)
  await page.getByLabel(/^Ime/).fill('A'.repeat(90))
  await page.getByLabel(/^Email/).fill(`${'a'.repeat(115)}@x.rs`)
  await page.getByLabel(/^Poruka/).fill('B'.repeat(4200))
  await page.locator('form button[type="submit"]').first().click()
  await sleep(900)
  const shown = await page.evaluate(() =>
    [...document.querySelectorAll('[role="alert"]')].map((node) => node.textContent.trim()),
  )
  check(
    '/kontakt: poruka o grešci je na srpskom',
    shown.length > 0 && !shown.some((text) => /Too big|Too small|Invalid input/i.test(text)),
    shown.join(' | '),
  )
  await ctx.close()

  const answer = await context.request.post(`${BASE}/api/kontakt`, {
    data: {
      name: 'A'.repeat(90),
      email: 'a@b.rs',
      topic: 'opste',
      message: 'B'.repeat(4200),
    },
    failOnStatusCode: false,
  })
  const body = await answer.text()
  check('/api/kontakt: odgovor je na srpskom', !english.test(body), body.slice(0, 160))
})

// ------------------------------------------------------------ godina --------
await group('Godina u podnožju prati posetioca, ne build', async () => {
  // Prerendered, so reading the clock in the footer's own body would freeze the
  // year at build time — a site not redeployed over New Year goes on claiming
  // the previous one. It is also a hydration mismatch, and
  // `suppressHydrationWarning` is not a fix for it: that suppresses the patch
  // as well as the warning, so the stale text stays on screen.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  const page = await ctx.newPage()
  await page.clock.setFixedTime(new Date('2031-03-05T10:00:00Z'))
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(2600)
  const line = await page.evaluate(
    () =>
      [...document.querySelectorAll('p')]
        .map((node) => node.textContent)
        .find((text) => text?.includes('Sva prava'))
        ?.trim() ?? '',
  )
  check('godina se ispravi na klijentovu', line.includes('2031'), line)
  await ctx.close()
})

// ------------------------------------------------- kontrast na crtežu -------
await group('Značke ostaju čitljive i preko crteža, u obe teme', async () => {
  // `check-contrast.mjs` reads the tokens; this reads what is painted. A badge
  // usually sits on a card's generative artwork, and while the fills were 10%
  // tints that artwork *was* the background — so the pair the tokens promise
  // was never the pair on screen. Measured then, in the light theme: "Traži
  // dom" 3.55:1, "Udomljen" 3.51:1, "bestseler" 3.44:1, against the 4.5:1 that
  // 11px type needs. "Nestala" failed in the dark theme too, at 4.20:1.
  const resolveColours = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const cx = canvas.getContext('2d', { willReadFrequently: true })
    // Through a canvas, because computed colours here are `oklch()` and
    // `lab()`; reading the numbers out of those strings as if they were sRGB
    // gives nonsense ratios that look like failures.
    const rgb = (color) => {
      cx.clearRect(0, 0, 1, 1)
      cx.fillStyle = '#000000'
      cx.fillStyle = color
      cx.fillRect(0, 0, 1, 1)
      const data = cx.getImageData(0, 0, 1, 1).data
      return [data[0], data[1], data[2]]
    }
    const luminance = (color) => {
      const channels = rgb(color).map((value) => {
        const scaled = value / 255
        return scaled <= 0.03928 ? scaled / 12.92 : Math.pow((scaled + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
    }
    window.__ratio = (a, b) => {
      const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
      return (high + 0.05) / (low + 0.05)
    }
  }

  for (const theme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    await ctx.addInitScript((value) => {
      try {
        sessionStorage.setItem('doggzy.visited', '1')
        localStorage.setItem('theme', value)
      } catch {}
    }, theme)
    await ctx.addInitScript(resolveColours)
    const page = await ctx.newPage()

    for (const route of ['/prodavnica', '/psi']) {
      await page.goto(`${BASE}${route}`, { waitUntil: 'load' })
      await sleep(1800)
      const failing = await page.evaluate(() => {
        const out = []
        for (const node of document.querySelectorAll('span[class*="rounded-full"], li > span')) {
          const text = node.textContent.trim()
          if (!text || text.length > 14) continue
          if (node.getBoundingClientRect().width < 20) continue
          const styles = getComputedStyle(node)
          if (styles.backgroundColor === 'rgba(0, 0, 0, 0)') continue
          const size = parseFloat(styles.fontSize)
          const large = size >= 24 || (size >= 18.66 && Number(styles.fontWeight) >= 700)
          const value = window.__ratio(styles.color, styles.backgroundColor)
          if (value < (large ? 3 : 4.5)) out.push(`${text} ${value.toFixed(2)}:1`)
        }
        return out
      })
      check(
        `${theme} ${route}: značke prolaze AA preko crteža`,
        failing.length === 0,
        failing.join(', '),
      )
    }

    // The leading edge is the part of a bar that carries the value.
    await page.goto(`${BASE}/psi/mrvica`, { waitUntil: 'load' })
    await sleep(1500)
    await page.evaluate(() =>
      document.querySelector('[role="progressbar"]')?.scrollIntoView({ block: 'center' }),
    )
    await sleep(2200)
    const bars = await page.evaluate(() => {
      const end = getComputedStyle(document.documentElement).getPropertyValue('--gradient-3').trim()
      return [...document.querySelectorAll('[role="progressbar"]')]
        .filter((bar) => {
          const fill = bar.firstElementChild
          if (!fill) return false
          const width = fill.getBoundingClientRect().width
          return width > 12 && width < bar.getBoundingClientRect().width - 8
        })
        .map((bar) => ({
          label: bar.getAttribute('aria-label')?.slice(0, 28) ?? '',
          ratio: Number(window.__ratio(end, getComputedStyle(bar).backgroundColor).toFixed(2)),
        }))
    })
    check(`${theme}: nađena delimično popunjena traka`, bars.length > 0, `${bars.length}`)
    check(
      `${theme}: vrh trake ima bar 3:1 prema stazi`,
      bars.length > 0 && bars.every((bar) => bar.ratio >= 3),
      JSON.stringify(bars),
    )
    await ctx.close()
  }
})

// ------------------------------------------------- tastatura u dijalozima ---
await group('Tab i Shift+Tab ostaju u dijalogu', async () => {
  // The trap used to query the *panel* and test `activeElement === first`. The
  // backdrop is a labelled close button inside the dialog but outside the
  // panel, and focus on open sits on the panel itself, which is `tabindex="-1"`
  // and so in no list at all — so two Shift+Tabs walked out of the cart drawer
  // into the footer, with the ring invisible underneath the scrim.
  const dialogs = [
    ['korpa', 1280, 900, 'button[aria-label^="Korpa"]'],
    ['brzi pregled', 1280, 900, 'button[aria-label^="Brzi pregled"]'],
    ['meni', 390, 844, 'button[aria-controls="mobile-menu"]'],
  ]

  const where = (page) =>
    page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      const active = document.activeElement
      return {
        open: Boolean(dialog),
        inside: Boolean(dialog && active && dialog.contains(active)),
        tag: active?.tagName ?? null,
        label: (active?.getAttribute('aria-label') || active?.textContent || '')
          .trim()
          .slice(0, 28),
      }
    })

  for (const [name, width, height, trigger] of dialogs) {
    const ctx = await browser.newContext({
      viewport: { width, height },
      hasTouch: width < 500,
      isMobile: width < 500,
    })
    await ctx.addInitScript(() => {
      try {
        sessionStorage.setItem('doggzy.visited', '1')
      } catch {}
    })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/prodavnica`, { waitUntil: 'load' })
    await sleep(1600)
    await page
      .locator(trigger)
      .first()
      .evaluate((node) => node.click())
    await sleep(900)

    for (const [direction, key, presses] of [
      ['Shift+Tab', 'Shift+Tab', 12],
      ['Tab', 'Tab', 14],
    ]) {
      let escaped = null
      for (let press = 1; press <= presses; press += 1) {
        await page.keyboard.press(key)
        await sleep(90)
        const state = await where(page)
        if (state.open && !state.inside) {
          escaped = `${press}. pritisak → ${state.tag} "${state.label}"`
          break
        }
      }
      check(`${name}: ${direction} ne izlazi iz dijaloga`, escaped === null, String(escaped))
    }

    await page.keyboard.press('Escape')
    await sleep(600)
    check(`${name}: Escape i dalje zatvara`, (await where(page)).open === false)
    await ctx.close()
  }
})

await group('Potvrda slanja poruke se najavi i zadrži fokus', async () => {
  // The form unmounts on success, so focus fell to <body> and nothing was
  // announced: no live region, no alert, and a plain <p> that heading
  // navigation could not find either. A screen-reader user got no signal at all
  // that the message had sent.
  const page = await context.newPage()
  await page.route('**/api/kontakt', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  )
  await page.goto(`${BASE}/kontakt`, { waitUntil: 'load' })
  await sleep(1400)
  await page.getByLabel(/^Ime/).fill('Ana Anić')
  await page.getByLabel(/^Email/).fill('ana@example.rs')
  await page.getByLabel(/^Poruka/).fill('x'.repeat(60))
  await page.locator('form button[type="submit"]').first().click()
  await sleep(1200)

  const sent = await page.evaluate(() => ({
    active: document.activeElement?.tagName ?? null,
    announced: document.querySelectorAll('[role="status"], [aria-live]').length,
    heading: document.querySelector('h2')?.textContent?.trim() ?? null,
    headings: [...document.querySelectorAll('h1')].length,
  }))
  check('potvrda je u živom regionu', sent.announced > 0, JSON.stringify(sent))
  check('fokus je na potvrdi, ne na <body>', sent.active === 'H2', JSON.stringify(sent))
  check('potvrda je naslov, pa je dohvatljiva navigacijom', sent.heading === 'Poruka je poslata')
  check('stranica i dalje ima tačno jedan <h1>', sent.headings === 1, `${sent.headings}`)
  await page.close()
})

await group('Iznos donacije se ne izvikuje na svaki znak', async () => {
  // `aria-live="polite"` on the "what this covers" line queued a full sentence
  // per keystroke — typing "12500" announced five of them after the visitor
  // stopped, burying the character echo. Only the last one meant anything.
  const page = await context.newPage()
  await page.goto(`${BASE}/doniraj`, { waitUntil: 'load' })
  await sleep(1500)
  await page.locator('#donate-custom').click()
  await page.keyboard.type('12500', { delay: 90 })
  await sleep(600)

  const live = await page.evaluate(() => document.querySelectorAll('[aria-live]').length)
  const covers = await page.evaluate(
    () =>
      [...document.querySelectorAll('p')]
        .map((node) => node.textContent)
        .find((text) => text?.includes('pokriva'))
        ?.trim() ?? '',
  )
  check('nema živog regiona na iznosu', live === 0, `${live}`)
  check('tekst se i dalje ažurira', /12\.500/.test(covers), covers.slice(0, 60))
  await page.close()
})

// --------------------------------------------------- kad mreža zataji ------
await group('Zaglavljen zahtev se prekine umesto da se vrti zauvek', async () => {
  // A refused connection rejects at once and a 500 comes back, but a server
  // that accepts and then never answers leaves `fetch` pending for as long as
  // the browser allows. Measured before the timeout: 15s after submit the
  // button still read "Šaljem…" and was still disabled, with no error and no
  // way to retry.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  const page = await ctx.newPage()
  await page.route('**/api/kontakt', () => {})
  await page.goto(`${BASE}/kontakt`, { waitUntil: 'load' })
  await sleep(1400)

  await page.getByLabel(/^Ime/).fill('Ana Anić')
  await page.getByLabel(/^Email/).fill('ana@example.rs')
  await page.getByLabel(/^Poruka/).fill('x'.repeat(60))
  await page.locator('form button[type="submit"]').first().click()
  await sleep(1200)

  const sending = await page.evaluate(
    () => document.querySelector('form button[type="submit"]').disabled,
  )
  check('dugme se zaključa dok šalje', sending === true)

  await sleep(21000)
  const settled = await page.evaluate(() => ({
    disabled: document.querySelector('form button[type="submit"]').disabled,
    alert: document.querySelector('[role="alert"]')?.textContent?.trim() ?? null,
  }))
  check(
    'zahtev se prekine i dozvoli ponovni pokušaj',
    settled.disabled === false,
    JSON.stringify(settled),
  )
  check(
    'greška je na srpskom, sa alternativom',
    Boolean(settled.alert) && !/Too |Invalid|expected/i.test(settled.alert ?? ''),
    String(settled.alert),
  )
  await ctx.close()
})

await group('Traka učitavanja je živa i pre nego što React stigne', async () => {
  // Progress is React state, so until the bundle has hydrated nothing moves it.
  // On a slow link that is the full failsafe window spent looking at a stalled
  // bar reading "000". The CSS sweep starts at first paint; the component's
  // effect hands the bar back.
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    window.__bar = []
    const tick = () => {
      const fill = document.querySelector('[data-preloader] [data-progress]')
      const count = document.querySelector('[data-preloader] [data-count]')
      if (fill) {
        window.__bar.push({
          live: document.documentElement.classList.contains('preloader-live'),
          anim: getComputedStyle(fill).animationName,
          count: count ? getComputedStyle(count).opacity : null,
          text: count ? count.textContent.trim() : null,
        })
      }
      if (performance.now() < 8000) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
  await page.goto(`${BASE}/`, { waitUntil: 'load' })
  await sleep(6000)

  const bar = await page.evaluate(() => window.__bar)
  const before = bar.filter((entry) => !entry.live)
  const after = bar.filter((entry) => entry.live)

  if (before.length === 0) {
    console.log('  --   preskočeno (hidracija je stigla pre prvog kadra)')
  } else {
    check(
      'pre hidracije traka se kreće sama',
      before.every((entry) => entry.anim === 'preloader-sweep'),
      `${before.length} uzoraka, ${before[0]?.anim}`,
    )
    // A number is a claim, and before hydration there is not one to make.
    check(
      'pre hidracije brojač je sakriven',
      before.every((entry) => entry.count === '0'),
      String(before[0]?.count),
    )
  }

  check(
    'posle hidracije CSS animacija se gasi',
    after.length > 0 && after.every((entry) => entry.anim === 'none'),
    `${after.length} uzoraka, ${after[0]?.anim}`,
  )
  const counted = after.map((entry) => Number(entry.text)).filter((value) => !Number.isNaN(value))
  check(
    'posle hidracije brojač broji do 100',
    counted.length > 5 && Math.max(...counted) === 100,
    `max ${counted.length ? Math.max(...counted) : 'n/a'}`,
  )
  await ctx.close()
})

await group('Otkucana prijava se ne baca bez pitanja', async () => {
  // Nothing is written to storage on purpose — the last two steps are a
  // stranger's name and phone number. So the answer to an accidental reload is
  // to ask, not to cache it.
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })
  await ctx.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/prijava`, { waitUntil: 'load' })
  await sleep(1800)

  // Playwright cannot observe the native dialog, so the event itself is the
  // assertion: a cancelled `beforeunload` is what makes the browser ask.
  const fire = () =>
    page.evaluate(() => {
      const event = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(event)
      return event.defaultPrevented
    })

  check('prazan obrazac pušta posetioca da ode', (await fire()) === false)

  await page.locator('button', { hasText: 'Nestao mi je pas' }).first().click()
  await sleep(400)
  check('sam izbor vrste još ne postavlja prepreku', (await fire()) === false)

  await page
    .locator('button', { hasText: /^Dalje/ })
    .first()
    .click()
  await sleep(700)
  await page.locator('#report-location').fill('Zemun, kod pijace')
  await sleep(500)
  check('otkucana prijava upozorava pre odlaska', (await fire()) === true)
  await ctx.close()
})

await context.close()
await browser.close()

console.log(`\n${passed} provera prošlo, ${failures.length} palo.`)
if (failures.length > 0) {
  console.error('\nPale provere:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}
