"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { FormField } from "./form-field";
import { Mail, Phone, UserRound } from "lucide-react";
import type { FormFieldProps } from "./types";

interface ProfileFormSectionsProps {
  register: FormFieldProps["register"];
  errors: Record<string, { message?: string } | undefined>;
  disabled: boolean;
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
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          disabled={disabled}
          error={errors.email?.message}
          required
          register={register}
        />
        <FormField
          id="phone"
          label="Phone number"
          type="tel"
          placeholder="+62 812-3456-7890"
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
      />
      <Separator />
    </div>
  );
}
