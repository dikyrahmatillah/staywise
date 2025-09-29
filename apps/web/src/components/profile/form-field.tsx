"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FormFieldProps } from "./types";

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  disabled,
  error,
  required,
  register,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && "*"}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-9"
          aria-invalid={Boolean(error)}
          {...register(id)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
