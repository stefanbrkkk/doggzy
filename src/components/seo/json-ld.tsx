/**
 * Renders JSON-LD.
 *
 * The payload is built from typed helpers in `lib/structured-data.ts` and
 * serialised here with `<` escaped, so a stray character in content can never
 * close the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
