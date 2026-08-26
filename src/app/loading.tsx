import { Container } from '@/components/ui/section'

/**
 * Route-level fallback. Mirrors the page rhythm rather than showing a spinner,
 * so navigation reads as the next page arriving instead of the current one
 * being replaced by a loading screen.
 */
export default function Loading() {
  return (
    <div className="pb-section pt-36 sm:pt-44" role="status" aria-label="Učitavanje">
      <Container>
        <div className="max-w-3xl space-y-5">
          <div className="h-3 w-28 animate-pulse rounded-full bg-elevated" />
          <div className="h-14 w-full animate-pulse rounded-2xl bg-elevated" />
          <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-elevated" />
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-elevated" />
        </div>
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div key={card} className="h-72 animate-pulse rounded-4xl bg-elevated" />
          ))}
        </div>
      </Container>
    </div>
  )
}
