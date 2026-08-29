[Back to Docs Index](README.md)

# Architecture

Doggzy is a Serbian-language site for a dog rescue: it lists the dogs, takes
lost-dog reports, sells goods whose profit pays for care, and publishes what
every dinar was spent on. One Next.js 15 application, no database, no CMS.

This document describes what is in the repository. `README.md` at the root
covers the reasoning behind the harder choices; this one is the map.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, Turbopack |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4, configured in CSS (`src/app/globals.css`) |
| Motion | Framer Motion 12, Lenis for smooth scroll |
| Validation | Zod 4, shared between browser and route handlers |
| Auth | `jose` (JWT in an HTTP-only cookie), Node `scrypt` for the password hash |
| Mail | Resend, optional — the site works without it |
| Icons | `lucide-react` |
| Testing | Playwright, driven by plain scripts in `scripts/` |

There is no `tailwind.config.ts`, deliberately: Tailwind v4 ignores it unless
`@config` links it, and its presence previously silenced every custom token.

There is no database. Content is TypeScript in `src/content/` and ships with the
deploy. There is no image pipeline: every dog and product carries an art
descriptor and the artwork is generated deterministically from it.

## Routes

Public pages, all statically rendered:

| Path | What it is |
| --- | --- |
| `/` | Home. Hero with the interactive report phone. |
| `/prijava` | Report a dog — lost, found, or in trouble. |
| `/psi`, `/psi/[slug]` | The dogs, and each dog's public timeline. |
| `/prodavnica`, `/prodavnica/[slug]` | Shop and product pages. |
| `/korpa`, `/omiljeno` | Basket and favourites (client state, `noindex`). |
| `/doniraj` | Donation instructions and the amount picker. |
| `/price`, `/price/[slug]` | Case stories, start to finish. |
| `/transparentnost` | Where the money went, by line item. |
| `/o-nama`, `/kontakt` | About and contact. |
| `/privatnost`, `/uslovi`, `/pristupacnost` | Legal and accessibility. |

The three `[slug]` segments set `dynamicParams = false`, so an unknown slug is a
real 404 rather than an on-demand render served with a year-long cache.

Admin: `/admin` and `/admin/login`, both `no-store`.

API routes: `/api/prijava` (report, multipart), `/api/kontakt`, `/api/health`,
and `/api/admin/{login,logout,me}`.

`middleware.ts` guards everything under `/admin` and `/api/admin`. It runs on the
Edge runtime, so it only verifies the token — Node's crypto and `next/headers`
are not available there, which is why `src/lib/auth.ts` (Node) and
`src/lib/auth-edge.ts` (Edge) are separate files.

## Directories

```
src/
├─ app/              routes, API handlers, metadata, icons, sitemap, robots
├─ components/
│  ├─ motion/        Reveal, SplitText, Magnetic, TiltCard, Marquee, Spotlight…
│  ├─ visuals/       generative artwork and the WebGL background
│  ├─ phone/         the phone frame and the report flow inside it
│  ├─ shop/          catalogue, cards, quick view, basket, drawer
│  ├─ dogs/          dog cards and the public timeline
│  ├─ transparency/  ledger tables and coverage bars
│  ├─ layout/        header, footer, preloader
│  ├─ providers/     theme, shop store, smooth scroll, MotionConfig
│  ├─ seo/           JSON-LD
│  └─ ui/            button, field, badge, section primitives
├─ content/          dogs.ts, products.ts, stories.ts
├─ config/           site.ts — routes, navigation, contact details
└─ lib/              motion tokens, schemas, auth, rate limit, art, store
```

## Content model

`src/content/dogs.ts` — each dog has a slug, a status, the declined forms of its
name (Serbian inflects names that sit next to prepositions), a list of needs with
`cost` and `covered`, and a timeline. Timeline entries carry `verified`, which is
true only where a receipt or a vet's confirmation exists; the UI renders
unverified entries differently rather than hiding the difference.

`src/content/products.ts` — price in whole dinars, category, badges, an art
descriptor, and an impact claim expressed as `impactUnits` × `impactCost` so the
claim can be checked by multiplication rather than trusted as prose.

`src/content/stories.ts` — case stories, each tied to a dog.

Every figure shown on the site is checked against the ledgers by
`scripts/check-figures.mjs`, which fails the build on a claim the content cannot
support.

## Client state

`src/lib/store/shop-store.tsx` holds the basket and favourites in a React context
persisted to `localStorage` under `doggzy.shop.v1`. Reads and writes go through
`safeStorage` in `src/lib/scroll-lock.ts`, which never throws — a browser with
site data blocked returns `null` instead of taking the page down.

Scroll locking is reference-counted in the same file. Four surfaces can lock
(preloader, mobile menu, cart drawer, quick view) and more than one can be open
at once, so the original `body { overflow }` value is captured and restored
exactly once. The lock also stops the smooth-scroll driver: Lenis moves
`window.scrollY` programmatically, and `overflow: hidden` does not stop it.

## Auth

`npm run admin:hash` produces a scrypt hash to put in `ADMIN_PASSWORD_HASH`. The
login route rate-limits per IP and per account, verifies with a constant-time
comparison, and issues a JWT in an HTTP-only, `SameSite=Lax`, `Secure` cookie.
Every session-dependent response is sent `no-store` with `Vary: Cookie`.

The admin area is read-only. Editing content through the web needs a database;
until there is one, the panel shows state rather than offering buttons that save
nothing.

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes in production | canonical URLs, sitemap, OG |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` | for the admin area | login |
| `AUTH_SECRET` | for the admin area | JWT signing |
| `RESEND_API_KEY`, `NOTIFY_TO`, `NOTIFY_FROM` | optional | delivery of form submissions |

Without the Resend variables the forms still validate and answer; the submission
is logged rather than mailed.

## Rendering and performance

Everything public is static. No public page fetches data on load — the only
network calls a visitor causes are the two form submissions — so the shipped JS
is the interaction layer and nothing else.

Two rules earn their own note, because breaking either is invisible in review:

- `backdrop-filter` is for chrome that floats over a page which is not moving.
  Over a scrolling region the compositor re-reads the backdrop every frame, and
  the cost is set by area, not blur radius. `scripts/perf.mjs` fails the build if
  dropped frames during a scripted scroll cross 20%.
- Never hand-write `-webkit-backdrop-filter` beside the standard property.
  Lightning CSS treats the two as one declaration and keeps the last, which once
  shipped the prefixed form alone — supported by nothing current.

## Checks

`npm run check` runs typecheck, lint, the script check, the contrast check, the
figures check and a production build. `npm run test:e2e` and `npm run test:perf`
run against a build that is already serving. See `release-checklist.md`.
