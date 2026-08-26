# Doggzy

Pomoć psima koja se može proveriti.

Doggzy je platforma za Srbiju koja spaja tri stvari: prijavu nestalog,
pronađenog ili ugroženog psa; udomljavanje i virtuelno starateljstvo; i prodavnicu
čiji profit ide u negu. Svaki trošak je javan — svaki pas ima stranicu na kojoj
stoji šta je urađeno, koliko je koštalo i da li postoji dokaz.

Ovaj repozitorijum je sam sajt.

---

## Šta je unutra

| Ruta                                       | Šta radi                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `/`                                        | Početna: hero sa interaktivnim telefonom, objašnjenje toka, kalkulator uticaja, psi, prodavnica, priče |
| `/prijava`                                 | Prijava psa u pet koraka — radi bez naloga, šalje se na `/api/prijava`                                 |
| `/psi`, `/psi/[slug]`                      | Lista pasa i pojedinačna stranica sa javnim dnevnikom troškova                                         |
| `/doniraj`                                 | Iznos, učestalost i cilj donacije; generiše podatke za uplatu sa pozivom na broj                       |
| `/prodavnica`, `/prodavnica/[slug]`        | Katalog sa animiranim filtriranjem i stranice proizvoda                                                |
| `/korpa`, `/omiljeno`                      | Korpa i lista sačuvanih proizvoda (čuva se u pregledaču)                                               |
| `/price`, `/price/[slug]`                  | Dugačke priče, povezane sa dnevnikom psa o kome govore                                                 |
| `/transparentnost`                         | Zbirni dnevnik svih unosa, sa filtriranjem                                                             |
| `/o-nama`, `/kontakt`                      | Ko smo i forma za kontakt (`/api/kontakt`)                                                             |
| `/privatnost`, `/uslovi`, `/pristupacnost` | Pravne stranice                                                                                        |
| `/admin`                                   | Pregled sadržaja iza prijave                                                                           |

## Tehnologija

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Lenis · Zod · jose · Resend

Trinaest zavisnosti u produkciji, bez ijedne koja se ne koristi.

## Pokretanje

```bash
npm install
cp .env.example .env.local     # popuni šta ti treba
npm run dev
```

Sajt radi i bez ijedne promenljive okruženja. Bez njih:

- prijave i poruke se validiraju i upisuju u log servera umesto da idu na mejl;
- admin prijava je isključena i stranica to jasno kaže.

### Admin

```bash
npm run admin:hash             # ispisuje AUTH_SECRET i ADMIN_PASSWORD_HASH
```

Upiši oba u `.env.local`, dodaj `ADMIN_EMAIL`, i prijava radi. Heš je razdvojen
dvotačkom (`scrypt:so:heš`), a ne dolarom — `dotenv` proširuje `$` u vrednostima
i tiho bi odsekao heš.

## Provere

```bash
npm run check                  # tipovi, lint, latinica, kontrast, iznosi, build
npm run test:e2e               # 264 provere kroz pravi pregledač
npm run test:perf              # LCP, CLS, težina, ispušteni kadrovi
```

Pet provera postoji zato što su odgovarajuće greške već napravljene u ovom
projektu i nisu se videle na pregled:

- **`check:script`** traži ćirilične karaktere u latiničnom tekstu. Homoglifi
  (`о` vs `o`) izgledaju identično, a razbijaju pretragu i URL-ove.
- **`check:contrast`** računa WCAG odnose direktno iz `globals.css`
  (OKLCH → linearni sRGB → luminansa) i pada ako neki par padne ispod praga.
  Uhvatila je četiri para u svetloj temi, uključujući natpis na glavnom dugmetu.
  Alfa se kompozituje u gama prostoru, kao u pregledaču — u linearnom je svaka
  providna boja izgledala kontrastnije nego što jeste.
- **`test:e2e`** proverava i ono što se ne vidi u kodu: `Intl` piše srpske
  mesece ćirilicom ako se lokal ne zaključa na `sr-Latn-RS`.
- **`check:figures`** proverava svaki iznos na sajtu prema dnevnicima pasa.
  Ista stavka je koštala 2.600 RSD u kalkulatoru i 3.800 u dnevniku, a jedan
  duks je „plaćao mikročipovanje pet pasa” — što traži 1.098 RSD profita po
  čipu. Sada tvrdnja proizvoda mora da izdrži množenje.
- **`test:perf`** meri ispuštene kadrove tokom skrolovanja. Zrno preko celog
  ekrana sa `mix-blend-mode` obaralo je 67% kadrova na stranici prodavnice.

Neke od tih provera postoje zato što se kvar ne vidi u izvornom kodu. Lightning
CSS je iz `backdrop-filter` pravila izbacivao standardno svojstvo i ostavljao
samo `-webkit-` oblik, pa nijedna staklena površina nije imala zamućenje —
pravilo u `globals.css` je izgledalo ispravno. `body { overflow: hidden }` je
izgledao kao brava, a Lenis je i dalje pomerao stranicu iza svakog modala.
`transform-style: preserve-3d` je terao Chromium da testira pogotke po ravni
koja se ne poklapa sa crtežom, pa 53% ekrana telefona nije primalo klikove. E2E
zato čita izračunate vrednosti u pravom pregledaču, a ne tekst u stilu.

## Struktura

```
src/
├─ app/              rute (App Router) + API rute
├─ components/
│  ├─ motion/        primitive: Reveal, SplitText, Magnetic, TiltCard, …
│  ├─ visuals/       generativna grafika i WebGL pozadina
│  ├─ phone/         okvir telefona i tok prijave
│  ├─ shop/          katalog, korpa, kartice proizvoda
│  ├─ dogs/          kartice pasa i javni dnevnik
│  ├─ layout/        zaglavlje, podnožje, preloader
│  └─ ui/            dugme, polje, značka, sekcije
├─ content/          psi, proizvodi, priče (TypeScript, ne CMS)
├─ config/           rute, kontakt, metapodaci
└─ lib/              utils, motion tokeni, šeme, auth, rate limit
```

Sadržaj živi u `src/content/` i objavljuje se deploy-om. Uređivanje kroz veb
zahteva bazu; dok je nema, admin panel prikazuje stanje umesto da nudi dugmad
koja ništa ne čuvaju.

## Dizajn

Sistem je definisan u `src/app/globals.css`, u Tailwind v4 `@theme` bloku.
`tailwind.config.ts` **ne postoji namerno** — v4 ga ignoriše osim ako se
eksplicitno poveže sa `@config`, i upravo je to ranije tiho ugasilo sve
prilagođene tokene: `shadow-glow` i `bg-mesh-gradient` nisu generisali nikakav
CSS.

Boje su u OKLCH. Tamna tema je podrazumevana; dubina se gradi svetlom, ne
senkom — svaka površina je svetlija od pozadine. Svetla tema nije ista paleta
sa manjom prozirnošću: brend se u njoj potamnjuje, jer belo na svetlonarandžastom
matematički ne može da dostigne 4.5:1.

Nema fotografija. Svaki pas i svaki proizvod nosi opis generativne ilustracije
koju `<GenerativeArt>` crta iz heša njegovog ID-a — isti pas, ista slika, svaki
put, bez ijednog rasterskog fajla.

## Pristupačnost

Ceo sajt radi tastaturom, poštuje „smanji animacije”, ima vidljiv fokus koji
prolazi 3:1, i vraća fokus na element koji je otvorio dijalog. Šta još nije
urađeno piše na `/pristupacnost` — uključujući to da nezavisna revizija nije
rađena.

## Licenca

Privatno. Sva prava zadržana.
