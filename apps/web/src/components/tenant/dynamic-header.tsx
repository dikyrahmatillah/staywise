"use client";

import { usePathname } from "next/navigation";

const routeTitleMap: Record<string, string> = {
  "/dashboard/tenant": "Overview",
  "/dashboard/tenant/properties": "List Property",
  "/dashboard/tenant/properties/add": "Add Property",
  "/dashboard/tenant/properties/categories": "Property Categories",
  "/dashboard/tenant/properties/rooms": "Room Management",
  "/dashboard/tenant/transactions": "Transactions",
  "/dashboard/tenant/reports/sales": "Sales Reports",
  "/dashboard/tenant/reports/properties": "Property Reports",
  "/dashboard/tenant/reviews": "Reviews",
  "/dashboard/tenant/account": "Profile & Account",
};

export function DynamicHeader() {
  const pathname = usePathname();
  const title = routeTitleMap[pathname] || "Dashboard";

  return <h1 className="text-lg font-semibold tracking-tight">{title}</h1>;
}
