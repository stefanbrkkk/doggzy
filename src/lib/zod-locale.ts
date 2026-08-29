import { z } from 'zod'

/**
 * Serbian text for every rule that does not carry its own message.
 *
 * Zod's defaults are English sentences written for developers — "Too big:
 * expected string to have <=4000 characters" — and this codebase hands
 * `issues[0].message` straight to the visitor: the contact form prints it under
 * the field, the report flow prints it inside the phone, and both route
 * handlers echo it in their 422. Every `.min()` on the site was given Serbian
 * text and every `.max()` was not, so the English only surfaced for someone who
 * pasted too much — the least likely person to be running a debugger.
 *
 * Importing this module installs the map globally, so it has to be imported
 * before anything parses. Schema modules and route handlers that build their
 * own schema both do that; a per-rule message still wins over what is here, so
 * this is a floor rather than a replacement.
 */
z.config({
  customError: (issue) => {
    switch (issue.code) {
      case 'too_big':
        if (issue.origin === 'array') return 'Izabrano je previše stavki.'
        if (issue.origin === 'number') return 'Vrednost je prevelika.'
        return 'Unos je predugačak.'
      case 'too_small':
        if (issue.origin === 'array') return 'Izaberi bar jednu stavku.'
        if (issue.origin === 'number') return 'Vrednost je premala.'
        return 'Unos je prekratak.'
      case 'invalid_type':
        // No path means the whole body failed, not a field: "this field is
        // required" would be nonsense for a request that is not even an object.
        return issue.path?.length ? 'Ovo polje je obavezno.' : 'Zahtev nije ispravan.'
      case 'invalid_value':
        return 'Izaberi jednu od ponuđenih opcija.'
      default:
        return 'Unos nije ispravan.'
    }
  },
})
