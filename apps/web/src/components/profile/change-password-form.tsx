"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { changePasswordSchema, ChangePasswordInput } from "@repo/schemas";
import api from "@/lib/axios";
import { Loader2, Lock, ShieldCheck, ShieldEllipsis } from "lucide-react";
import { useSession } from "next-auth/react";
import { PasswordInput } from "./password-input";
import {
  PasswordChecklist,
  PasswordStrengthIndicator,
} from "./password-strength";
import { calculatePasswordInsights } from "./utils";

export function ChangePasswordForm() {
  const { data: session } = useSession();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordInput & { confirmPassword: string }>({
    resolver: zodResolver(
      changePasswordSchema
        .extend({
          confirmPassword: changePasswordSchema.shape.newPassword,
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
    ),
  });

  const newPasswordValue = watch("newPassword");
  const passwordInsights = useMemo(
    () => calculatePasswordInsights(newPasswordValue),
    [newPasswordValue]
  );

  const onSubmit = useCallback(
    async (data: ChangePasswordInput) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        await api.put(
          "/auth/change-password",
          {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        toast.success("Password changed successfully!");
        reset();
      } catch (error: unknown) {
        console.error("Change password error:", error);
        let errorMessage = "Failed to change password";

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          errorMessage =
            axiosError.response?.data?.message || "Failed to change password";
        }

        toast.error(errorMessage);
      }
    },
    [session?.user?.accessToken, reset]
  );

  return (
    <Card className="relative overflow-hidden border-border/50 bg-background/95 shadow-xl ring-1 ring-border/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,17,26,0.05),transparent_60%)]" />
      <CardHeader className="relative z-[1]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-semibold">
              Change password
            </CardTitle>
            <CardDescription>
              Refresh your credentials and keep your account invulnerable.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-[1]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <PasswordChecklist insights={passwordInsights} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PasswordInput
              id="currentPassword"
              label="Current password"
              icon={Lock}
              showPassword={showCurrentPassword}
              onToggleShow={() => setShowCurrentPassword(!showCurrentPassword)}
              disabled={isSubmitting}
              error={errors.currentPassword?.message}
              register={register}
            />

            <PasswordInput
              id="newPassword"
              label="New password"
              icon={ShieldEllipsis}
              showPassword={showNewPassword}
              onToggleShow={() => setShowNewPassword(!showNewPassword)}
              disabled={isSubmitting}
              error={errors.newPassword?.message}
              register={register}
            />

            <PasswordInput
              id="confirmPassword"
              label="Confirm new password"
              icon={ShieldCheck}
              showPassword={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
              error={errors.confirmPassword?.message}
              register={register}
            />

            <PasswordStrengthIndicator insights={passwordInsights} />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => reset()}
              >
                Reset fields
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="sm:min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
