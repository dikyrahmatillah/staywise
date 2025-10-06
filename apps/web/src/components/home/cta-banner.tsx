import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTABanner() {
  return (
    <section className="w-full py-10">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="rounded-xl border border-slate-200 p-6 md:p-8 bg-gradient-to-r from-white to-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-slate-900">
              Ready to find your next stay?
            </h3>
            <p className="text-slate-600 mt-1">
              Browse thousands of verified properties with transparent pricing.
            </p>
          </div>
          <div>
            <Button asChild>
              <Link href="/properties">Explore properties</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
