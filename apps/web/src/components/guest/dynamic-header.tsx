"use client";

import { usePathname } from "next/navigation";

const routeTitleMap: Record<string, string> = {
  "/dashboard/guest": "Overview",
  "/dashboard/guest/account": "Profile & Account",
  "/dashboard/guest/bookings": "Booking History",
  "/dashboard/guest/wishlist": "Favorites / Wishlist",
};

export function DynamicHeader() {
  const pathname = usePathname();
  const title = routeTitleMap[pathname] || "Dashboard";

  return <h1 className="text-lg font-semibold tracking-tight">{title}</h1>;
}
