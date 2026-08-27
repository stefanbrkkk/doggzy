/**
 * Reference-counted scroll lock.
 *
 * Four surfaces can lock scrolling — the preloader, the mobile menu, the cart
 * drawer and the shop's quick view — and more than one can be open at a time. Each capturing and
 * restoring `document.body.style.overflow` independently meant that whichever
 * closed last wrote back a value captured while another lock was already
 * active, leaving the page permanently unscrollable. Counting instead means the
 * original value is restored exactly once, when the last holder releases.
 */

let holders = 0
let previousOverflow: string | null = null

/**
 * The smooth-scroll driver, registered by <SmoothScroll>.
 *
 * `body { overflow: hidden }` stops the *user* scrolling the viewport, but the
 * viewport stays programmatically scrollable — and Lenis runs in root mode, so
 * it swallows the wheel event and moves `window.scrollY` itself. Every overlay
 * on the site was scrollable behind, and the visitor was left at the new
 * position when it closed; on a first visit the curtain lifted onto mid-page.
 */
interface ScrollDriver {
  /** Returns false when the underlying instance does not exist yet. */
  stop: () => boolean
  start: () => void
}

let driver: ScrollDriver | null = null

/**
 * Asks the driver to stop, and keeps asking until it can.
 *
 * <SmoothScroll> registers in a layout effect and every lock is taken in a
 * passive one, so in practice the first call succeeds. The retry is for the
 * orderings that are not guaranteed — a lock taken before the driver exists at
 * all, or a driver that cannot reach its instance yet. It deliberately keeps
 * going while `driver` is null too: an early return there gave a lock exactly
 * one chance, and a page that scrolls underneath a modal is not the kind of
 * failure to leave to luck. Re-asserting on animation frames costs nothing once
 * it lands and needs no knowledge of when the library is ready.
 */
function assertStopped(deadline = performance.now() + 3000): void {
  if (holders === 0) return
  if (driver?.stop()) return
  if (performance.now() > deadline) return
  requestAnimationFrame(() => assertStopped(deadline))
}

/**
 * Hands the scroll driver to `lockScroll`.
 *
 * Deliberately tolerant of ordering: the preloader can take a lock before this
 * ever runs, so a driver registering into an already-locked page stops itself
 * immediately rather than waiting for the next lock.
 */
export function registerScrollDriver(next: ScrollDriver | null): void {
  driver = next
  if (driver && holders > 0) assertStopped()
}

export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => {}

  if (holders === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  holders += 1
  assertStopped()

  let released = false
  return () => {
    if (released) return
    released = true
    holders = Math.max(0, holders - 1)
    if (holders === 0) {
      document.body.style.overflow = previousOverflow ?? ''
      previousOverflow = null
      driver?.start()
    }
  }
}

/**
 * Storage that never throws.
 *
 * Safari in private mode, and any browser with site data blocked, throws on
 * both read and write. An unguarded `setItem` inside an animation callback
 * skipped the rest of that callback, which is how a blocked-storage browser
 * ended up stuck behind the preloader.
 */
export const safeStorage = {
  get(storage: 'session' | 'local', key: string): string | null {
    try {
      return (storage === 'session' ? sessionStorage : localStorage).getItem(key)
    } catch {
      return null
    }
  },
  set(storage: 'session' | 'local', key: string, value: string): boolean {
    try {
      ;(storage === 'session' ? sessionStorage : localStorage).setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  remove(storage: 'session' | 'local', key: string): void {
    try {
      ;(storage === 'session' ? sessionStorage : localStorage).removeItem(key)
    } catch {
      // Nothing to recover from: the value was never stored.
    }
  },
}
