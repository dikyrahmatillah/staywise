import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import QueryProvider from "@/components/providers/query-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayWise",
  description: "Your one-stop solution for finding the perfect rental property",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <SessionProvider>
            <QueryProvider>
              <Toaster />
              <Header />
              <main className="min-h-[calc(100vh-12rem)]">{children}</main>
              <Footer />
            </QueryProvider>
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
