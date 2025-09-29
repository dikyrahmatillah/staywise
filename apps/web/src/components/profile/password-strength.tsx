"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ShieldCheck, ShieldEllipsis, ShieldQuestion } from "lucide-react";
import type { PasswordInsights } from "./types";

interface PasswordStrengthIndicatorProps {
  insights: PasswordInsights;
}

export function PasswordStrengthIndicator({
  insights,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className={cn("text-sm font-medium", insights.tone)}>
          {insights.label}
        </p>
        <span className="text-xs text-muted-foreground">
          Strength score • {insights.percent}%
        </span>
      </div>
      <Progress
        value={insights.percent}
        className="h-2 bg-border/60"
        indicatorClassName={insights.indicator}
      />
    </div>
  );
}

export function PasswordChecklist({
  insights,
}: PasswordStrengthIndicatorProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20 p-6">
      <div className="pointer-events-none absolute -left-8 top-6 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-28 w-28 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ShieldEllipsis className="h-4 w-4" />
          Password checklist
        </div>
        <div className="space-y-2">
          {insights.checklist.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition",
                item.met
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : "border-border/60 bg-background text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border",
                  item.met
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-600"
                    : "border-border text-muted-foreground"
                )}
                aria-hidden
              >
                {item.met ? (
                  <ShieldCheck className="h-3.5 w-3.5" />
                ) : (
                  <ShieldQuestion className="h-3.5 w-3.5" />
                )}
              </div>
              <span className="leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
