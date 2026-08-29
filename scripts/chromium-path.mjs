import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Finds a Chromium binary Playwright can launch.
 *
 * Playwright pins an exact build number and refuses to start when the
 * installed browser does not match — which happens whenever the package is
 * upgraded without re-running `playwright install`, and on prepared images that
 * ship one build under a shared PLAYWRIGHT_BROWSERS_PATH. Falling back to any
 * chromium in that directory keeps the suite runnable in both places.
 *
 * Returns `undefined` to let Playwright use its own bundled browser, which is
 * the right answer in CI where `playwright install` has just run.
 */
export function resolveChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH

  const root = process.env.PLAYWRIGHT_BROWSERS_PATH
  if (!root || !existsSync(root)) return undefined

  const candidates = readdirSync(root)
    .filter((name) => name.startsWith('chromium'))
    // Highest build number first, and the full browser before the headless
    // shell — the shell cannot render the WebGL paths the suite checks.
    .sort((a, b) => (Number(b.split('-').pop()) || 0) - (Number(a.split('-').pop()) || 0))
    .flatMap((name) => [
      join(root, name, 'chrome-linux', 'chrome'),
      join(root, name, 'chrome-linux', 'headless_shell'),
      join(root, name, 'chrome-headless-shell-linux64', 'chrome-headless-shell'),
    ])

  return candidates.find((path) => existsSync(path))
}
