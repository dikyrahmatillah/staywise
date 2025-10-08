"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/ui/primary-button";
import AuthHeader from "@/components/auth/auth-header";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/auth-error.utils";
import Link from "next/link";
import EmailSent from "@/components/auth/email-sent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      setEmailSent(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error: unknown) {
      const message =
        extractErrorMessage(error) ||
        (error instanceof Error
          ? error.message
          : "Failed to send reset email. Please try again.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Forgot password"
          caption="Enter your email to reset your password"
        />

        <div>
          {emailSent ? (
            <EmailSent
              email={email}
              onTryAgain={() => setEmailSent(false)}
              message={
                <>
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>. Please check your inbox and follow
                  the instructions.
                </>
              }
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={loading}
                />
              </div>

              <PrimaryButton
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </PrimaryButton>

              <div className="text-center">
                <Link
                  href="/signin"
                  className="text-sm text-primary hover:underline"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
