'use client'

import { Marquee } from '@/components/motion'

const CLAIMS = [
  'Prijava radi bez naloga',
  'Svaki trošak ima datum i iznos',
  'Nepotvrđeno stoji označeno kao nepotvrđeno',
  '100% profita prodavnice ide u negu',
  'Virtuelno starateljstvo šalje mesečni izveštaj',
  'Kontakt prijavioca nikada nije javan',
]

/**
 * A slow claim ticker between the hero and the explainer. Purely typographic —
 * no logos of partners we have not signed.
 */
export function Ticker() {
  return (
    <div className="border-y border-line bg-surface py-5">
      <Marquee speed={56}>
        {CLAIMS.map((claim) => (
          <span key={claim} className="flex items-center gap-8 px-8">
            <span className="whitespace-nowrap text-sm text-ink-muted">{claim}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand" />
          </span>
        ))}
      </Marquee>
    </div>
  )
}
