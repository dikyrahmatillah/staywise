"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Newsletter() {
  return (
    <section className="w-full py-10 md:py-14 bg-slate-50">
      <div className="container mx-auto max-w-3xl px-4 md:px-6 text-center">
        <h2 className="text-xl md:text-2xl font-semibold">Stay in the loop</h2>
        <p className="text-slate-600 mt-1">
          Get fresh deals and travel inspiration. No spam.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-5 flex flex-col sm:flex-row gap-2"
        >
          <Input
            type="email"
            placeholder="Your email"
            required
            className="bg-white"
          />
          <Button type="submit">Subscribe</Button>
        </form>
        <p className="text-xs text-slate-500 mt-2">
          By subscribing you agree to our terms.
        </p>
      </div>
    </section>
  );
}
