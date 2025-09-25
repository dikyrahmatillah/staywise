"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import NavLink from "@/components/dashboard/nav-link";

type Item = {
  label: string;
  href: string;
};

export type Group = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: Item[];
  href?: string;
};

export default function GroupItem({
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
