import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading properties…</div>}>
      <PropertiesClient />
    </Suspense>
  );
}
