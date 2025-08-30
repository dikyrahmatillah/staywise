import { GuestSidebar } from "@/components/guest/guest-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function GuestDashboardPage() {
  return (
    <div className="flex min-h-dvh">
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
            <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
          </div>
        </header>
        <section className="p-4 text-sm text-muted-foreground">
          Select a menu from the sidebar to get started.
        </section>
      </main>
    </div>
  );
}
