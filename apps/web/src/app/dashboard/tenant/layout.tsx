import type { Metadata } from "next";
import { TenantSidebar } from "@/components/tenant/tenant-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Breadcrumb } from "../../../components/tenant/breadcrumb";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Tenant Dashboard",
  description:
    "Manage your property listings, bookings, and revenue. Track performance and guest reviews on StayWise.",
  noIndex: true, // Don't index dashboard pages
});

interface TenantLayoutProps {
  children: React.ReactNode;
}

export default function TenantLayout({ children }: TenantLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.12),transparent_45%),radial-gradient(circle_at_80%_0%,hsl(var(--primary)/0.08),transparent_50%),radial-gradient(circle_at_40%_80%,hsl(var(--primary)/0.1),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] px-3 sm:px-6 lg:px-10">
        <div className="hidden md:block pt-10 pb-8">
          <div className="h-full rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_-35px_rgba(15,23,42,0.55)] dark:border-slate-800/70 dark:bg-slate-900/70">
            <TenantSidebar />
          </div>
        </div>

        <main className="flex-1 pb-10 pt-10 md:pl-8">
          <div className="flex h-full min-w-0 flex-col rounded-3xl border border-slate-200/70 bg-white/75 p-4 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.55)] backdrop-blur-2xl transition-shadow dark:border-slate-800/70 dark:bg-slate-900/75 sm:p-6 lg:p-8">
            <header className="sticky top-0 z-30 mx:-4 -mt-4 mb-6 flex items-center justify-between border-b border-slate-200/60 bg-white/70  py-4 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/60 sm:mx-0 sm:-mt-6 sm:rounded-2xl ">
              <div className="flex items-center gap-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="md:hidden h-10 w-10 border-slate-200/60 bg-white/80 text-slate-600 shadow-sm transition-colors hover:bg-slate-100/80 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Open sidebar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-80 border-r border-slate-200/70 bg-white/90 p-0 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90"
                  >
                    <TenantSidebar isSheet />
                  </SheetContent>
                </Sheet>

                <Breadcrumb />
              </div>
            </header>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
