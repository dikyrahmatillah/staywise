"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const routeTitleMap: Record<string, string> = {
  "/dashboard/tenant": "Overview",
  "/dashboard/tenant/properties": "List Property",
  "/dashboard/tenant/properties/add": "Add Property",
  "/dashboard/tenant/properties/categories": "Category Management",
  "/dashboard/tenant/transactions": "Transactions",
  "/dashboard/tenant/reports/sales": "Sales Reports",
  "/dashboard/tenant/reports/properties": "Property Reports",
  "/dashboard/tenant/reviews": "Reviews",
  "/dashboard/tenant/account": "Profile & Account",
};

function segmentTitle(segment: string, fullPath: string) {
  const mapped = routeTitleMap[fullPath];
  if (mapped) return mapped;
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isIdSegment(seg: string) {
  if (!seg) return false;
  const numeric = /^\d+$/;
  const uuid =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  const hex24 = /^[0-9a-fA-F]{24}$/;
  return numeric.test(seg) || uuid.test(seg) || hex24.test(seg);
}

export function Breadcrumb() {
  const pathname = usePathname() || "/";

  const rawSegments = pathname.split("/").filter(Boolean);

  const crumbs = rawSegments.map((seg, idx) => {
    const path = "/" + rawSegments.slice(0, idx + 1).join("/");
    return { seg, path };
  });

  const visibleCrumbs = crumbs.filter((c) => !isIdSegment(c.seg));

  if (visibleCrumbs.length === 0) {
    return <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>;
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {visibleCrumbs.map((c, i) => {
          const isLast = i === visibleCrumbs.length - 1;
          const title = segmentTitle(c.seg, c.path);

          return (
            <li key={c.path} className="flex items-center">
              {!isLast ? (
                <Link
                  href={c.path}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {title}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {title}
                </span>
              )}

              {!isLast && (
                <ChevronRight className="ml-2 h-4 w-4 text-muted-foreground" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
