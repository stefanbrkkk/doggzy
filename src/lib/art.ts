/**
 * The vocabulary of generative compositions.
 *
 * Kept out of both the content and the component so neither has to depend on
 * the other: content files pick a shape, <GenerativeArt> knows how to draw it.
 */
export type ArtShape = 'orbit' | 'waves' | 'grid' | 'bloom' | 'pulse' | 'ridge' | 'prism' | 'trace'

export interface ArtDescriptor {
  shape: ArtShape
  /** Any CSS colour. Theme variables are resolved at paint time. */
  from: string
  to: string
}
