"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { FormField } from "./form-field";
import { Mail, Phone, UserRound } from "lucide-react";
import type { FormFieldProps } from "./types";

interface ProfileFormSectionsProps {
  register: FormFieldProps["register"];
  errors: Record<string, { message?: string } | undefined>;
  disabled: boolean;
  email?: string;
}

export function PersonalDetailsSection({
  register,
  errors,
  disabled,
}: ProfileFormSectionsProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Personal details
          </h4>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="firstName"
          label="First name"
          placeholder="James"
          icon={UserRound}
          disabled={disabled}
          error={errors.firstName?.message}
          required
          register={register}
        />
        <FormField
          id="lastName"
          label="Last name"
          placeholder="Doe"
          icon={UserRound}
          disabled={disabled}
          error={errors.lastName?.message}
          register={register}
        />
      </div>
    </section>
  );
}

export function ContactDetailsSection({
  register,
  errors,
  disabled,
  email,
}: ProfileFormSectionsProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Contact information
          </h4>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 ">
          <Label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </Label>
          <div className="flex items-center gap-2 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{email}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
        </div>
        <FormField
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="+62 8XX-XXXX-XXXX"
          icon={Phone}
          disabled={disabled}
          error={errors.phone?.message}
          register={register}
        />
      </div>
    </section>
  );
}

export function ProfileFormSections({
  register,
  errors,
  disabled,
  email,
}: ProfileFormSectionsProps) {
  return (
    <div className="space-y-10">
      <PersonalDetailsSection
        register={register}
        errors={errors}
        disabled={disabled}
      />
      <ContactDetailsSection
        register={register}
        errors={errors}
        disabled={disabled}
        email={email}
      />
      <Separator />
    </div>
  );
}
