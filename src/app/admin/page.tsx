import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  BadgeCheck,
  CircleAlert,
  Database,
  Mail,
  PawPrint,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import { formatRsd } from '@/lib/utils'
import { routes } from '@/config/site'
import { getSession } from '@/lib/auth'
import { isAuthConfigured } from '@/lib/auth-edge'
import { dogs, statusLabels } from '@/content/dogs'
import { products } from '@/content/products'
import { stories } from '@/content/stories'
import { Container, Eyebrow } from '@/components/ui/section'
import { Badge } from '@/components/ui/badge'
import { LogoutButton } from '@/components/admin/logout-button'

export const metadata: Metadata = {
  title: 'Pregled',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const session = await getSession()

  // The middleware normally handles this; the guard keeps the page safe if the
  // matcher is ever narrowed.
  if (!session) redirect(routes.adminLogin)

  const events = dogs.flatMap((dog) => dog.timeline)
  const unverified = events.filter((event) => !event.verified)
  const spent = events
    .filter((event) => event.type !== 'donacija' && typeof event.amount === 'number')
    .reduce((sum, event) => sum + (event.amount ?? 0), 0)

  const openNeeds = dogs.filter((dog) => dog.needs.some((need) => need.covered < need.cost))
  const outOfStock = products.filter((product) => !product.inStock)

  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_TO)

  return (
    <section className="pb-section pt-32 sm:pt-40">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Admin</Eyebrow>
            <h1 className="mt-4 text-title text-ink">Pregled sadržaja</h1>
            <p className="mt-3 text-sm text-ink-muted">Prijavljen kao {session.sub}</p>
          </div>
          <LogoutButton />
        </div>

        <dl className="mt-12 grid gap-px overflow-hidden rounded-4xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={PawPrint} label="Pasa u evidenciji" value={String(dogs.length)} />
          <Stat icon={ShoppingBag} label="Proizvoda" value={String(products.length)} />
          <Stat icon={Sparkles} label="Priča" value={String(stories.length)} />
          <Stat icon={Database} label="Zabeleženo troškova" value={formatRsd(spent)} />
        </dl>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel
            title="Zahteva pažnju"
            description="Stavke koje su vidljive javno, a nisu potpune."
          >
            <ul className="space-y-3">
              <Attention
                ok={unverified.length === 0}
                label={`${unverified.length} unosa bez dokaza`}
                detail="Nepotvrđeni unosi su javno označeni, ali ih treba potkrepiti računom ili nalazom."
              />
              <Attention
                ok={openNeeds.length === 0}
                label={`${openNeeds.length} pasa sa nepokrivenim lečenjem`}
                detail={openNeeds.map((dog) => dog.name).join(', ') || 'Sve je pokriveno.'}
              />
              <Attention
                ok={outOfStock.length === 0}
                label={`${outOfStock.length} proizvoda van stanja`}
                detail={outOfStock.map((product) => product.name).join(', ') || 'Sve je na stanju.'}
              />
            </ul>
          </Panel>

          <Panel title="Podešavanja okruženja" description="Bez prikazivanja tajni — samo status.">
            <ul className="space-y-3">
              <Attention
                ok={isAuthConfigured()}
                label="Admin prijava"
                detail="AUTH_SECRET, ADMIN_EMAIL i ADMIN_PASSWORD_HASH."
              />
              <Attention
                ok={emailConfigured}
                label="Slanje email obaveštenja"
                detail={
                  emailConfigured
                    ? 'Prijave i poruke stižu na NOTIFY_TO.'
                    : 'RESEND_API_KEY i NOTIFY_TO nisu postavljeni — prijave se samo upisuju u log servera.'
                }
                icon={Mail}
              />
              <Attention
                ok={Boolean(process.env.NEXT_PUBLIC_SITE_URL)}
                label="Apsolutni URL sajta"
                detail="NEXT_PUBLIC_SITE_URL se koristi u sitemap-u i OG oznakama."
              />
            </ul>
          </Panel>
        </div>

        <Panel
          className="mt-6"
          title="Psi"
          description="Klikom otvaraš javnu stranicu sa dnevnikom."
        >
          <ul className="divide-y divide-line">
            {dogs.map((dog) => {
              const dogUnverified = dog.timeline.filter((event) => !event.verified).length
              return (
                <li key={dog.id}>
                  <Link
                    href={routes.dog(dog.slug)}
                    className="flex flex-wrap items-center justify-between gap-3 py-3.5 transition-colors hover:text-brand-text"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-sm text-ink">{dog.name}</span>
                      <Badge size="sm">{statusLabels[dog.status]}</Badge>
                    </span>
                    <span className="flex items-center gap-4 text-xs text-ink-subtle">
                      <span data-numeric>{dog.timeline.length} unosa</span>
                      {dogUnverified > 0 ? (
                        <span className="text-critical">
                          <span data-numeric>{dogUnverified}</span> bez dokaza
                        </span>
                      ) : (
                        <span className="text-positive">sve potvrđeno</span>
                      )}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Panel>

        <div className="mt-8 rounded-4xl border border-line bg-elevated p-7">
          <h2 className="text-headline text-ink">Uređivanje sadržaja</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Psi, proizvodi i priče žive u datoteci, u{' '}
            <code className="font-mono text-xs text-ink">src/content/</code>, i objavljuju se
            deploy-om. Uređivanje kroz veb zahteva bazu — dok je ne povežemo, ovaj panel namerno
            samo prikazuje stanje umesto da nudi dugmad koja ništa ne čuvaju.
          </p>
        </div>
      </Container>
    </section>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof PawPrint
  label: string
  value: string
}) {
  return (
    <div className="bg-elevated p-6">
      <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
      <dt className="mt-4 text-2xs uppercase tracking-widest text-ink-subtle">{label}</dt>
      <dd data-numeric className="mt-1.5 text-headline text-ink">
        {value}
      </dd>
    </div>
  )
}

function Panel({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-4xl border border-line bg-elevated p-7 ${className ?? ''}`}>
      <h2 className="text-headline text-ink">{title}</h2>
      <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Attention({
  ok,
  label,
  detail,
  icon: Icon,
}: {
  ok: boolean
  label: string
  detail: string
  icon?: typeof BadgeCheck
}) {
  const Marker = Icon ?? (ok ? BadgeCheck : CircleAlert)
  return (
    <li className="flex gap-3">
      <Marker
        aria-hidden="true"
        className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'text-positive' : 'text-critical'}`}
      />
      <span>
        <span className="block text-sm text-ink">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-ink-subtle">{detail}</span>
      </span>
    </li>
  )
}
