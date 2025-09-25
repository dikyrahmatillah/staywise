"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar({
  collapsed,
  onToggle,
  title,
  children,
  className,
}: {
  collapsed: boolean;
  onToggle: () => void;
  isSheet?: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "h-dvh shrink-0 bg-background transition-[width] duration-200",
        "backdrop-blur-sm/5",
        collapsed ? "w-20" : "w-80",
        className
      )}
      aria-label={`${title} navigation`}
    >
      <div
        className={cn(
          "h-20 border-b px-4 text-base font-semibold flex items-center justify-between gap-2 relative",
          "transition-colors"
        )}
      >
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
              <span className="text-sm font-semibold">{title}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-pressed={collapsed}
          onClick={onToggle}
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
        {children}
      </ScrollArea>
    </aside>
  );
}
