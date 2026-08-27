[Back to Docs Index](README.md)

# Release Checklist

Everything here is enforced by a script wherever it can be. Run the scripts; use
your eyes for the rest.

## 1. Gates that must pass

```bash
npm run check        # typecheck · lint · script · contrast · figures · build
```

That is `tsc --noEmit`, `eslint .`, and four content checks:

| Check | What it catches |
| --- | --- |
| `check:script` | Cyrillic homoglyphs in Latin text — `о` vs `o` breaks search and URLs |
| `check:contrast` | a WCAG pair falling below its threshold, computed from `globals.css` |
| `check:figures` | a claim the ledgers cannot support, and fabricated fields |
| the build | anything the type checker missed |

Formatting is separate and cheap:

```bash
npm run format:check
```

## 2. Gates that need a running build

```bash
npm run build && npm run start &
npm run test:e2e     # ~320 assertions in a real browser
npm run test:perf    # LCP, CLS, weight, long tasks, dropped frames
```

Both read computed values out of a real browser rather than reading source,
because the defects that matter here are not visible in review: a CSS property
silently dropped by the minifier, a scroll lock that reads correctly but does not
apply, hit-testing that diverges from paint. `test:perf` fails if a scripted
scroll drops more than 20% of its frames.

Neither can run against `next dev`. Build first.

## 3. The console, in development

```bash
npm run dev -- -p 3100 &
npm run check:console
```

React only ships its hydration diffing in development, and StrictMode only
double-invokes render there — so a whole class of defect is invisible to the
suite above. The generative artwork consumed a mutable pseudo-random sequence
inside a child component, and the second StrictMode pass drew from further along
than the server had; production said nothing while every dog card hydrated as a
different flower. This suite walks every route, a first visit with the curtain,
and the main interactions, and fails on any console error or warning.

Do not run `next build` while that dev server is up — both write `.next`.

## 4. Content

- [ ] Every figure on the site traces to a ledger entry (`check:figures` proves
      it, but read what it prints).
- [ ] `verified: true` appears only where a receipt or a vet's confirmation
      exists.
- [ ] New dogs have `nameAccusative` and `nameDative` set correctly — Serbian
      inflects, and the copy puts the name straight after prepositions.
- [ ] No claim the site cannot show the receipt for: no ratings, no review
      counts, no partner logos, no social profiles that do not exist.
- [ ] Legal pages still describe what the site actually does.

## 5. What to look at by hand

The scripts cover the measurable. These need a person:

- [ ] Both themes on the pages you touched. The site is dark-first; light mode
      is where a token mistake shows up.
- [ ] A phone in landscape, not just portrait. Short viewports are where layout
      breaks — the mobile menu, the filter bar, and any dialog.
- [ ] The report flow on `/prijava`, start to confirmation, on a real phone-sized
      viewport.
- [ ] The first-visit intro: open a private window so the session flag is unset.
- [ ] `prefers-reduced-motion: reduce` on. Nothing decorative should move.

## 6. Environment before deploying

- [ ] `NEXT_PUBLIC_SITE_URL` is the production origin. Canonical URLs, the
      sitemap and every social card read from it.
- [ ] `AUTH_SECRET` is set and is not the development value.
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` are set (`npm run admin:hash`).
- [ ] `RESEND_API_KEY`, `NOTIFY_TO` and `NOTIFY_FROM` are set, or you accept
      that form submissions are logged rather than mailed.

## 7. After deploying

- [ ] `/api/health` answers 200.
- [ ] `/sitemap.xml` and `/robots.txt` render, and `robots.txt` still disallows
      `/admin` and `/api/`.
- [ ] A social card renders — paste a product URL into a link preview.
- [ ] `/admin/login` accepts the production credentials, and `/admin` redirects
      to it when signed out.
- [ ] An unknown URL returns a real 404, not a 200.
