"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, ReceiptText, UserCog, Heart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Item = {
  label: string;
  href: string;
};

type Group = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: Item[];
  href?: string;
};

const nav: Group[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/guest" },

  {
    label: "Profile & Account",
    icon: UserCog,
    href: "/dashboard/guest/account",
  },
  {
    label: "Booking History",
    icon: ReceiptText,
    href: "/dashboard/guest/bookings",
  },
  {
    label: "Favorites / Wishlist",
    icon: Heart,
    href: "/dashboard/guest/wishlist",
  },
];

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      {children}
    </Link>
  );
}

function GroupItem({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  const hasChildren = group.items && group.items.length > 0;
  const Icon = group.icon;

  if (!hasChildren && group.href) {
    return (
      <li>
        <NavLink href={group.href}>
          <Icon className="size-4" />
          <span>{group.label}</span>
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <div
        className={cn(
          "overflow-hidden transition-[grid-template-rows]",
          open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        )}
      >
        <ul className="ml-2 border-l pl-2 text-sm text-muted-foreground overflow-hidden">
          {group.items?.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href}>
                <span className="relative pl-4">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-foreground/50" />
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export function GuestSidebar() {
  return (
    <aside className="h-dvh w-72 shrink-0 border-r bg-background">
      <div className="h-14 border-b px-4 text-sm font-medium flex items-center">
        Guest Dashboard
      </div>
      <ScrollArea className="h-[calc(100dvh-3.5rem)] px-2 py-3">
        <ul className="space-y-1">
          {nav.map((g, idx) => (
            <React.Fragment key={g.label}>
              <GroupItem group={g} />
              {idx === 0 || idx === 2 ? <Separator className="my-1" /> : null}
            </React.Fragment>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
