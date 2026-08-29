[Back to Docs Index](README.md)

# Media Guide

This site ships no photographs, no video, and no raster image files at all. That
is a deliberate constraint, not a gap waiting to be filled.

A rescue that has just been founded has no photo library, and stock photographs
of dogs it has never met would contradict the one thing the site is for: showing
what actually happened, with receipts. So the visual system is generative.

## Generative artwork

Every dog, product and story carries an art descriptor:

```ts
art: { shape: 'orbit', from: 'var(--color-mint-400)', to: 'var(--color-iris-500)' }
```

`src/lib/art.ts` holds the vocabulary — the eight shapes and the descriptor
type — and `src/components/visuals/generative-art.tsx` draws it: the entry's id
is hashed (FNV-1a) into the seed of an xorshift sequence, which places every
element of the composition. The same entry produces the same artwork on every
render, on the server and in the browser, with no file to store, optimise, or
serve.

Eight shapes are available: `orbit`, `waves`, `grid`, `bloom`, `pulse`, `ridge`,
`prism`, `trace`.

Guidance when picking one:

- Vary the shape between neighbouring cards. A grid of eight `orbit` covers reads
  as a rendering bug rather than a set.
- Use theme tokens for `from` and `to`, never literal colours. The artwork is
  drawn over a light ground as well as a dark one, and `--art-alpha` and
  `--art-ink` in `globals.css` adjust it per theme. A hard-coded colour ignores
  both.
- Match the subject loosely — `orbit` for a tracker, `waves` for water, `pulse`
  for something medical. It should read as considered, not literal.

## If real photography arrives later

Nothing in the design system depends on the absence of photographs, but adding
them is a real change, not a drop-in:

- The art descriptor stays as the fallback. Every dog and product needs a cover
  whether or not a photograph exists.
- Photographs of a dog that is up for adoption are personal data about the people
  who surrendered it as often as they are about the dog. Check
  `src/app/privatnost/page.tsx` before publishing any.
- Add width and height so the layout does not shift, and keep the aspect ratios
  the cards already use (square for products, square for dog covers).

## Icons and social images

- `src/app/icon.tsx` and `src/app/apple-icon.tsx` render the paw mark at request
  time via `ImageResponse`. The mark sits at ~62% of the canvas so it survives a
  maskable crop.
- `src/app/opengraph-image.tsx` renders the social card the same way. Every page
  points at it through `pageMetadata()` in `src/lib/metadata.ts`; a route that
  declares its own `openGraph` block without an `images` entry silently detaches
  from the file-based one, which is why pages go through that helper.
- `src/app/manifest.ts` lists the icon at both `any` and `maskable` purposes.

`npm run test:e2e` fetches each of these and fails if one 404s or comes back
empty — a blank install tile is not visible in review.

## Fonts

Four families, all self-hosted through `next/font`: Inter (text), Space Grotesk
(display), Instrument Serif (accents), JetBrains Mono (figures). Every one
includes the `latin-ext` subset. Without it the serif silently drops č, ć, š, ž
and đ mid-word.
