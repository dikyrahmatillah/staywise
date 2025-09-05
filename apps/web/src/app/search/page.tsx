import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-8">Loading search…</div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
