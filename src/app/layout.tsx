import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/components/layout/Layout'

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogiAI - AI-Powered Logistics Management",
  description: "Unified AI-powered logistics management platform for warehouse, transportation, distribution, and procurement operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
