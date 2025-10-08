"use client";

import React, { useState, useEffect, Suspense } from "react";
import Ellipsis from "@/components/ui/ellipsis";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/ui/primary-button";
import AuthHeader from "@/components/auth/auth-header";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordClientSchema, ResetPasswordClientInput } from "@/schemas";
import { useValidateToken } from "@/hooks/useValidateToken";
import InvalidTokenCard from "@/components/auth/invalid-token-card";
import { extractErrorMessage } from "@/lib/auth-error.utils";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordClientInput>({
    resolver: zodResolver(ResetPasswordClientSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { isLoading, isValid, error } = useValidateToken(
    token || undefined,
    "PASSWORD_RESET"
  );

  useEffect(() => {
    if (!token) router.push("/forgot-password");
  }, [token, router]);

  async function onSubmit(data: ResetPasswordClientInput) {
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });

      toast.success(
        "Your password has been reset successfully. You can now sign in with your new password."
      );

      setTimeout(() => router.push("/signin"), 1200);
    } catch (err: unknown) {
      const message =
        extractErrorMessage(err) ||
        (err instanceof Error ? err.message : "Failed to reset password.");
      toast.error(message);
    }
  }

  if (!token) return null;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-4">
            <Ellipsis size={8} color="var(--tw-text-opacity, #ef4444)" />
            <p className="text-sm text-muted-foreground">Validating token…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <InvalidTokenCard
        title="Invalid or expired link"
        caption="Need a new token?"
        linkHref="/forgot-password"
        linkWord="Get a new token"
        error={error}
      />
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Reset your password"
          caption="Enter your new password below"
        />

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                  className="w-full pr-10"
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  required
                  className="w-full pr-10"
                  disabled={isSubmitting}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <PrimaryButton
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-4 py-12">
          <Ellipsis />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
