/**
 * Anything the browser will stop on with Tab.
 *
 * Deliberately excludes `[tabindex="-1"]`: a dialog panel carries that so it can
 * be focused programmatically on open, but it is not a stop the visitor tabs to.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab inside an open dialog.
 *
 * Two mistakes are easy here and both were in this codebase, in all three
 * dialogs at once.
 *
 * The first is querying the *panel* rather than the element carrying
 * `role="dialog"`. The full-screen backdrop is a labelled close button that
 * lives inside the dialog but outside the panel, so it never joined the cycle —
 * and since it comes first in the DOM, one Shift+Tab landed on it and the next
 * walked straight out into the page underneath.
 *
 * The second is testing `activeElement === first`. On open, focus is on the
 * panel itself, which is `tabindex="-1"` and therefore in no list at all, so the
 * comparison was false and the guard never fired. Measured before this: two
 * Shift+Tabs out of the cart drawer, six and focus was on `<body>`; the ring was
 * invisible the whole way, because the elements it had escaped to sit under the
 * scrim. Anything not in the list counts as out of bounds instead.
 *
 * `root` is the `role="dialog"` element. Call it from a `keydown` listener on
 * `document`; it ignores every key but Tab.
 */
export function trapTab(root: HTMLElement | null, event: KeyboardEvent): void {
  if (event.key !== 'Tab' || !root) return

  const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (focusables.length === 0) return

  const active = document.activeElement as HTMLElement | null
  const index = active ? focusables.indexOf(active) : -1

  if (event.shiftKey) {
    // The first stop, or something that is not a stop at all — the panel on
    // open, or an element the page moved focus to behind the dialog.
    if (index <= 0) {
      event.preventDefault()
      focusables[focusables.length - 1].focus()
    }
    return
  }

  // Forward from the panel is left alone: the browser's own next stop is inside
  // the dialog, and overriding it would jump backwards to the backdrop.
  const within = active !== null && root.contains(active)
  if (index === focusables.length - 1 || !within) {
    event.preventDefault()
    focusables[0].focus()
  }
}
