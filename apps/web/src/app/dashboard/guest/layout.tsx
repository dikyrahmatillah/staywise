import type { Metadata } from "next";
import { GuestSidebar } from "@/components/guest/guest-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DynamicHeader } from "../../../components/guest/dynamic-header";

export const metadata: Metadata = {
  title: "StayWise Guest",
  description: "Your one-stop solution for finding the perfect rental property",
};

interface GuestLayoutProps {
  children: React.ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-12rem)]">
      <div className="hidden md:block">
        <GuestSidebar />
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
                <GuestSidebar />
              </SheetContent>
            </Sheet>
            <DynamicHeader />
          </div>
        </header>
        <section className="flex-1">{children}</section>
      </main>
    </div>
  );
}
