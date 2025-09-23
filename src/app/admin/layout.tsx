import type { Metadata } from "next";
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Admin Panel - Doggzy",
  description: "Doggzy admin panel for content management",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const user = await getCurrentUser()
  
  // If not authenticated and not on login page, this will be handled by middleware
  // This is just an additional server-side check
  if (!user && !children?.toString().includes('login')) {
    redirect('/admin/login')
  }

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