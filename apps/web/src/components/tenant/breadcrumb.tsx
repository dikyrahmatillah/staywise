"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, MoreHorizontal } from "lucide-react";

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

  const shouldCollapse = visibleCrumbs.length > 3;
  const renderCrumbs = shouldCollapse
    ? [
        visibleCrumbs[0],
        { seg: "...", path: "", collapsed: true as const }, // Ellipsis
        visibleCrumbs[visibleCrumbs.length - 1], // Last (current)
      ]
    : visibleCrumbs;

  return (
    <nav aria-label="Breadcrumb" className="overflow-hidden">
      <ol className="flex items-center gap-1 md:gap-2 text-sm text-muted-foreground flex-wrap lg:hidden">
        {renderCrumbs.map((c, i) => {
          const isLast = i === renderCrumbs.length - 1;
          const isCollapsed = "collapsed" in c && c.collapsed;
          const title = isCollapsed ? "..." : segmentTitle(c.seg, c.path);

          return (
            <li key={c.path || `collapsed-${i}`} className="flex items-center">
              {isCollapsed ? (
                <span className="inline lg:hidden text-muted-foreground px-1">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : !isLast ? (
                <Link
                  href={c.path}
                  className="text-sm md:text-sm text-muted-foreground hover:text-foreground transition-colors truncate max-w-[120px] md:max-w-none"
                >
                  {title}
                </Link>
              ) : (
                <span className="text-sm md:text-sm font-semibold text-foreground truncate max-w-[150px] md:max-w-none">
                  {title}
                </span>
              )}

              {!isLast && !isCollapsed && (
                <ChevronRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
              )}
            </li>
          );
        })}
      </ol>

      <ol className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        {visibleCrumbs.map((c, i) => {
          const isLast = i === visibleCrumbs.length - 1;
          const title = segmentTitle(c.seg, c.path);

          return (
            <li key={c.path} className="flex items-center">
              {!isLast ? (
                <Link
                  href={c.path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
