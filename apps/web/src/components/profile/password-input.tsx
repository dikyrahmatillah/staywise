"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import type { PasswordInputProps } from "./types";
import type { Path } from "react-hook-form";

export function PasswordInput<T extends Record<string, unknown>>({
  id,
  label,
  icon: Icon,
  showPassword,
  onToggleShow,
  disabled,
  error,
  register,
}: PasswordInputProps<T>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          disabled={disabled}
          className="pl-9 pr-12"
          aria-invalid={Boolean(error)}
          {...register(id as Path<T>)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          onClick={onToggleShow}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
