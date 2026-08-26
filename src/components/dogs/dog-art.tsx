import type { Dog } from '@/content/dogs'
import { GenerativeArt } from '@/components/visuals/generative-art'

export interface DogArtProps {
  dog: Dog
  className?: string
  interactive?: boolean
}

/**
 * Portrait stand-in for a dog.
 *
 * Shelters rarely have usable photography on day one, and inventing one would
 * be worse than admitting there isn't one. The generated piece is unique per
 * dog and stable over time, so a listing still reads as a specific animal.
 */
export function DogArt({ dog, className, interactive }: DogArtProps) {
  return (
    <GenerativeArt
      seed={dog.id}
      shape={dog.art.shape}
      from={dog.art.from}
      to={dog.art.to}
      alt={`Ilustracija — ${dog.name}`}
      className={className}
      interactive={interactive}
    />
  )
}
