import { chromium } from 'playwright'
import { resolveChromium } from './scripts/chromium-path.mjs'
import fs from 'node:fs'

const ROUTES = [
  '/', '/prijava', '/psi', '/psi/mrvica', '/psi/tesla', '/psi/lima', '/psi/bora', '/psi/siva', '/psi/pahulja',
  '/doniraj', '/prodavnica', '/korpa', '/omiljeno', '/price', '/transparentnost',
  '/o-nama', '/kontakt', '/privatnost', '/uslovi', '/pristupacnost', '/admin',
]
const WIDTHS = [320, 360, 390, 640, 768, 1024, 1280, 1440]
const THEMES = ['dark', 'light']

const browser = await chromium.launch({
  executablePath: resolveChromium(),
  args: ['--no-sandbox', '--no-proxy-server', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})

const results = []
for (const theme of THEMES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 })
  await ctx.addInitScript(([t]) => {
    try { sessionStorage.setItem('doggzy.visited', '1'); localStorage.setItem('theme', t) } catch {}
  }, [theme])
  const page = await ctx.newPage()
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 900 })
    for (const route of ROUTES) {
      try {
        await page.goto('http://localhost:3000' + route, { waitUntil: 'load', timeout: 20000 })
      } catch (e) {
        results.push({ theme, w, route, err: String(e).slice(0, 120) }); continue
      }
      await page.waitForTimeout(250)
      const info = await page.evaluate(() => {
        const de = document.documentElement
        const overflow = de.scrollWidth - de.clientWidth
        const offenders = []
        if (overflow > 0) {
          const lim = de.clientWidth
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) continue
            const cs = getComputedStyle(el)
            if (cs.position === 'fixed') continue
            if (r.right > lim + 1 || r.left < -1) {
              offenders.push({
                tag: el.tagName.toLowerCase(),
                cls: (el.getAttribute('class') || '').slice(0, 140),
                left: Math.round(r.left), right: Math.round(r.right),
              })
            }
          }
        }
        return { overflow, scrollW: de.scrollWidth, clientW: de.clientWidth, docH: de.scrollHeight,
                 offenders: offenders.slice(0, 10),
                 htmlClass: de.className.includes('light') ? 'light' : 'dark' }
      })
      results.push({ theme, w, route, ...info })
    }
  }
  await ctx.close()
}
fs.writeFileSync('/home/user/doggzy/.rev-shots/overflow.json', JSON.stringify(results, null, 2))
const bad = results.filter((r) => r.err || r.overflow > 0)
console.log('TOTAL', results.length, 'BAD', bad.length)
for (const b of bad) console.log(JSON.stringify({t:b.theme,w:b.w,r:b.route,o:b.overflow,e:b.err,off:b.offenders}))
await browser.close()
