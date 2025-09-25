"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  ReceiptText,
  BarChart3,
  UserCog,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  Home,
} from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";

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
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard/tenant" },
  {
    label: "Property Managements",
    icon: Building2,
    items: [
      { label: "List Property", href: "/dashboard/tenant/properties" },
      { label: "Add Property", href: "/dashboard/tenant/properties/add" },
      {
        label: "Property Categories",
        href: "/dashboard/tenant/properties/categories",
      },
    ],
  },

  {
    label: "Transactions",
    icon: ReceiptText,
    href: "/dashboard/tenant/transactions",
  },
  {
    label: "Reports",
    icon: BarChart3,
    items: [
      { label: "Sales Reports", href: "/dashboard/tenant/reports/sales" },
      {
        label: "Property Reports",
        href: "/dashboard/tenant/reports/properties",
      },
    ],
  },
  { label: "Reviews", icon: Star, href: "/dashboard/tenant/reviews" },
  {
    label: "Profile & Account",
    icon: UserCog,
    href: "/dashboard/tenant/account",
  },
];

function NavLink({
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
      {/* Active indicator */}
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

function GroupItem({
  group,
  collapsed,
}: {
  group: Group;
  collapsed?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = group.items && group.items.length > 0;
  const Icon = group.icon;

  if (!hasChildren && group.href) {
    return (
      <li>
        <NavLink href={group.href} collapsed={collapsed} label={group.label}>
          {collapsed ? (
            <Icon className="size-4 text-current" aria-hidden />
          ) : (
            <>
              <Icon className="size-4 text-current" />
              <span>{group.label}</span>
            </>
          )}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <div className="w-full">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          title={collapsed ? group.label : undefined}
          className={cn(
            "w-full select-none rounded-md px-3 py-2 text-left text-sm text-foreground/90",
            "hover:bg-accent hover:text-foreground flex items-center gap-2 justify-between cursor-pointer",
            collapsed && "justify-center px-2"
          )}
          aria-expanded={open}
        >
          <span
            className={cn(
              "flex items-center gap-2",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? (
              <Icon className="size-4 text-current" aria-hidden />
            ) : (
              <>
                <Icon className="size-4 text-current" />
                <span>{group.label}</span>
              </>
            )}
          </span>
          {!collapsed && (
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180"
              )}
            />
          )}
        </button>

        <div
          className={cn(
            "overflow-hidden transition-[height,opacity] duration-200 ease-in-out",
            open ? "h-auto opacity-100" : "h-0 opacity-0"
          )}
          aria-hidden={!open}
        >
          <ul
            className={cn(
              "ml-2 border-l pl-2 text-sm text-foreground overflow-hidden space-y-1 py-2",
              collapsed && "hidden"
            )}
          >
            {group.items?.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  label={item.label}
                  collapsed={collapsed}
                >
                  {collapsed ? (
                    <span
                      className="inline-flex items-center justify-center w-6 h-6"
                      aria-hidden
                    >
                      <span className="w-3 h-[2px] rounded-full bg-current" />
                    </span>
                  ) : (
                    <span className="relative pl-6">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[2px] rounded-full bg-current transition-transform group-hover:scale-110" />
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function TenantSidebar({ isSheet }: { isSheet?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-dvh shrink-0 bg-background transition-[width] duration-200",
        "backdrop-blur-sm/5",
        collapsed ? "w-20" : "w-72"
      )}
      aria-label="Tenant navigation"
    >
      <div
        className={cn(
          "h-20 border-b px-4 text-base font-semibold flex items-center justify-between gap-2 relative",
          "transition-colors"
        )}
      >
        {isSheet && (
          <div className="md:hidden absolute top-2 right-2">
            <SheetClose className="p-2 text-foreground hover:text-foreground focus:outline-none">
              <X className="size-4 text-current" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center w-full" : ""
          )}
        >
          {collapsed ? (
            <div className="rounded-lg bg-gradient-to-tr from-primary/10 to-primary/5 p-1 ring-1 ring-primary/10">
              <Home className="size-5 text-primary" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-gradient-to-tr from-primary/10 to-primary/5 p-1 ring-1 ring-primary/10 transition-transform duration-150 hover:scale-105">
                <Home className="size-5 text-primary" />
              </div>
              <span className="text-sm font-semibold">Tenant Dashboard</span>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-pressed={collapsed}
          onClick={() => setCollapsed((s) => !s)}
          className="text-foreground/70 hover:text-foreground p-1 rounded-md hidden md:inline-flex transition-colors cursor-pointer"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="size-4 text-current" />
          ) : (
            <ChevronLeft className="size-4 text-current" />
          )}
        </button>
      </div>

      <ScrollArea
        className={cn(
          "h-[calc(100vh-3.5rem)] px-2 py-3 transition-opacity",
          collapsed && "opacity-90"
        )}
      >
        <ul className="space-y-1">
          {nav.map((g, idx) => (
            <React.Fragment key={g.label}>
              <GroupItem group={g} collapsed={collapsed} />
              {idx === 0 || idx === 2 || idx === 5 ? (
                <Separator className="my-1" />
              ) : null}
            </React.Fragment>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
