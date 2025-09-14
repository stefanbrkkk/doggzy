import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Doggzy - Global Dog Rescue Charity | Donate & Shop to Save Lives",
  description: "Join Doggzy in our mission to rescue dogs worldwide. Donate directly, shop eco-friendly pet products, or sponsor a rescue dog. Every contribution saves lives and creates happy endings.",
  keywords: "dog rescue, animal charity, donate dogs, pet adoption, animal welfare, global rescue",
  authors: [{ name: "Doggzy Team" }],
  creator: "Doggzy",
  publisher: "Doggzy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://doggzy.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Doggzy - Global Dog Rescue Charity",
    description: "Join our mission to rescue dogs worldwide. Donate, shop, or sponsor to save lives.",
    url: 'https://doggzy.org',
    siteName: 'Doggzy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Doggzy - Global Dog Rescue',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doggzy - Global Dog Rescue Charity',
    description: 'Join our mission to rescue dogs worldwide. Donate, shop, or sponsor to save lives.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Navigation />
        <main className="pt-16 lg:pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
