import { Container, Eyebrow } from '@/components/ui/section'
import { Reveal } from '@/components/motion'

export interface LegalSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

/**
 * Shared shell for the legal pages, so privacy, terms and accessibility stay
 * typographically identical and only their content differs.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
}) {
  return (
    <section className="pb-section pt-36 sm:pt-44">
      <Container size="narrow">
        <Reveal direction="up" amount={0.4}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal direction="up" delay={0.06}>
          <h1 className="mt-5 text-title text-ink">{title}</h1>
        </Reveal>
        <Reveal direction="up" delay={0.12}>
          <p className="mt-5 text-lead text-ink-muted">{intro}</p>
        </Reveal>
        <Reveal direction="up" delay={0.16}>
          <p className="mt-4 text-sm text-ink-subtle">Poslednja izmena: {updated}</p>
        </Reveal>

        <div className="mt-16 space-y-12">
          {sections.map((section) => (
            <Reveal key={section.heading} direction="up" className="space-y-4">
              <h2 className="text-headline text-ink">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-[1.8] text-ink-muted">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="space-y-2.5 pt-1">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-base leading-relaxed text-ink-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand"
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
