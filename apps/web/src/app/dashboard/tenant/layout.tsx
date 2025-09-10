import type { Metadata } from "next";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DynamicHeader } from "../../../components/tenant/dynamic-header";

export const metadata: Metadata = {
  title: "StayWise Tenant Dashboard",
  description: "Manage your property listings and bookings",
};

interface TenantLayoutProps {
  children: React.ReactNode;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-12rem)]">
      <div className="hidden md:block">
        <TenantSidebar />
      </div>
      <main className="flex-1">
        <header className="h-14 border-b flex items-center px-4 justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
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
  );
}
