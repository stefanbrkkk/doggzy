import type { MetadataRoute } from 'next'
import { site } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    lang: 'sr-Latn-RS',
    start_url: '/',
    display: 'standalone',
    background_color: '#171514',
    theme_color: '#171514',
    orientation: 'portrait',
    categories: ['charity', 'lifestyle'],
    // The report flow is the reason anyone would install this.
    shortcuts: [
      {
        name: 'Prijavi psa',
        short_name: 'Prijava',
        description: 'Prijavi nestalog, pronađenog ili ugroženog psa',
        url: '/prijava',
      },
    ],
  }
}
