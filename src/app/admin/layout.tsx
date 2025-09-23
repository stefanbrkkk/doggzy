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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {children}
    </div>
  );
}
