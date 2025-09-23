import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Doggzy",
  description: "Doggzy admin panel for content management",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by middleware
  // No server-side auth check needed here

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 antialiased">
        {children}
      </body>
    </html>
  );
}