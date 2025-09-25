"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

export function NavLink({
  href,
  children,
  collapsed,
  label,
}: {
  href: string;
  children: React.ReactNode;
  collapsed?: boolean;
  label?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-md px-3 py-2 text-sm transition-colors relative flex items-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        collapsed ? "justify-center px-2 py-2" : "gap-2",
        active
          ? "bg-gradient-to-r from-primary/5 to-primary/2 text-primary"
          : "text-foreground hover:text-foreground/90 hover:bg-accent/50"
      )}
      title={
        collapsed
          ? label ?? (typeof children === "string" ? children : undefined)
          : undefined
      }
    >
      <span
        className={cn(
          "absolute left-0 top-0 h-full w-1 rounded-r-md transition-transform duration-200 ease-in-out",
          active
            ? "bg-primary/100 scale-y-100"
            : "bg-transparent scale-y-75 group-hover:bg-primary/30"
        )}
        aria-hidden
      />
      {children}
    </Link>
  );
}

export default NavLink;
