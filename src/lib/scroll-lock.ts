/**
 * Reference-counted scroll lock.
 *
 * Three surfaces can lock scrolling — the preloader, the mobile menu and the
 * cart drawer — and more than one can be open at a time. Each capturing and
 * restoring `document.body.style.overflow` independently meant that whichever
 * closed last wrote back a value captured while another lock was already
 * active, leaving the page permanently unscrollable. Counting instead means the
 * original value is restored exactly once, when the last holder releases.
 */

let holders = 0
let previousOverflow: string | null = null

export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => {}

  if (holders === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  holders += 1

  let released = false
  return () => {
    if (released) return
    released = true
    holders = Math.max(0, holders - 1)
    if (holders === 0) {
      document.body.style.overflow = previousOverflow ?? ''
      previousOverflow = null
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
