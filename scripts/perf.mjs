#!/usr/bin/env node
import { chromium } from 'playwright'
import { setTimeout as sleep } from 'node:timers/promises'

/**
 * Field-style performance probe.
 *
 * Measures the metrics that actually decide whether a heavily animated site
 * feels expensive or broken: LCP, CLS, transferred weight, long tasks during a
 * scripted scroll, and dropped frames. Run against a production build.
 */

const BASE = process.env.PERF_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
const ROUTES = ['/', '/prodavnica', '/psi', '/prijava', '/transparentnost']

// Budgets. Deliberately not aspirational — these are the lines that, if
// crossed, mean something regressed rather than "could be nicer".
const BUDGET = {
  lcpMs: 2500,
  cls: 0.1,
  jsKb: 400,
  totalKb: 900,
  longTasksDuringScroll: 12,
  droppedFrameRatio: 0.2,
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: [
    '--no-sandbox',
    '--no-proxy-server',
    '--use-gl=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
})

let failed = 0
const rows = []

for (const route of ROUTES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('doggzy.visited', '1')
    } catch {}
  })

  const page = await context.newPage()

  const bytes = { js: 0, css: 0, font: 0, other: 0 }
  page.on('response', async (response) => {
    const url = response.url()
    if (!url.startsWith(BASE)) return
    let size = 0
    try {
      size = Number((await response.headerValue('content-length')) ?? 0)
    } catch {
      return
    }
    if (url.includes('.js')) bytes.js += size
    else if (url.includes('.css')) bytes.css += size
    else if (url.includes('.woff')) bytes.font += size
    else bytes.other += size
  })

  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, longTasks: [] }
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.lcp = entry.startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__perf.cls += entry.value
      }
    }).observe({ type: 'layout-shift', buffered: true })

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__perf.longTasks.push(entry.duration)
    }).observe({ type: 'longtask', buffered: true })
  })

  await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 45000 })
  await sleep(2200)

  // Snapshot before scrolling: LCP keeps updating until the first user input,
  // so a scripted scroll would promote a below-the-fold element and report a
  // number that has nothing to do with what the visitor waited for.
  const settled = await page.evaluate(() => ({
    lcp: window.__perf.lcp,
    cls: window.__perf.cls,
    longTasks: window.__perf.longTasks.length,
  }))

  // Scripted scroll with frame accounting, so "smooth" is a number.
  const frames = await page.evaluate(async () => {
    const timestamps = []
    let running = true
    const tick = (time) => {
      timestamps.push(time)
      if (running) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    const height = document.body.scrollHeight
    const start = performance.now()
    while (performance.now() - start < 4000) {
      const progress = (performance.now() - start) / 4000
      window.scrollTo(0, progress * (height - window.innerHeight))
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
    running = false

    let dropped = 0
    for (let i = 1; i < timestamps.length; i += 1) {
      // Anything past ~1.5 frames at 60Hz is a visible hitch.
      if (timestamps[i] - timestamps[i - 1] > 25) dropped += 1
    }
    return { total: timestamps.length, dropped }
  })

  const perf = await page.evaluate(() => window.__perf)
  const longDuringScroll = perf.longTasks.length - settled.longTasks
  const droppedRatio = frames.total ? frames.dropped / frames.total : 0

  const jsKb = Math.round(bytes.js / 1024)
  const totalKb = Math.round((bytes.js + bytes.css + bytes.font + bytes.other) / 1024)

  const checks = [
    ['LCP', `${Math.round(settled.lcp)}ms`, settled.lcp <= BUDGET.lcpMs],
    ['CLS', perf.cls.toFixed(4), perf.cls <= BUDGET.cls],
    ['JS', `${jsKb}kB`, jsKb <= BUDGET.jsKb],
    ['ukupno', `${totalKb}kB`, totalKb <= BUDGET.totalKb],
    [
      'duge niti (skrol)',
      String(longDuringScroll),
      longDuringScroll <= BUDGET.longTasksDuringScroll,
    ],
    [
      'ispušteni kadrovi',
      `${(droppedRatio * 100).toFixed(1)}%`,
      droppedRatio <= BUDGET.droppedFrameRatio,
    ],
  ]

  console.log(`\n${route}`)
  for (const [label, value, ok] of checks) {
    if (!ok) failed += 1
    console.log(`  ${ok ? 'OK  ' : 'PAD '} ${label.padEnd(20)} ${value}`)
  }

  rows.push({
    route,
    lcp: Math.round(settled.lcp),
    cls: Number(perf.cls.toFixed(4)),
    jsKb,
    totalKb,
  })
  await context.close()
}

await browser.close()

console.log('\nSažetak')
console.table(rows)

if (failed > 0) {
  console.error(`\nperf: ${failed} mera van budžeta.`)
  process.exit(1)
}
console.log('\nperf: sve u budžetu.')
