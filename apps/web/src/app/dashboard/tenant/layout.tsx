import type { Metadata } from "next";
import { Figtree, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { DynamicHeader } from "../../../components/tenant/dynamic-header";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayWise Tenant",
  description: "Your one-stop solution for finding the perfect rental property",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        <main className="min-h-[calc(100vh-12rem)]">
          <div className="flex min-h-dvh">
            <div className="hidden md:block">
              <TenantSidebar />
            </div>
            <main className="flex-1">
              <header className="h-14 border-b flex items-center px-4 justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                      >
                        <Menu className="size-4" />
                        <span className="sr-only">Open Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                      <TenantSidebar />
                    </SheetContent>
                  </Sheet>
                  <DynamicHeader />
                </div>
              </header>
              <section className="flex-1 p-4">{children}</section>
            </main>
          </div>
        </main>
      </body>
    </html>
  );
}
