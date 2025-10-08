"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/ui/primary-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailSchema } from "@/schemas";
import { extractErrorMessage } from "@/lib/auth-error.utils";
import { signIn } from "next-auth/react";
import AuthHeader from "@/components/auth/auth-header";
import api from "@/lib/axios";

function GuestSignUpContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "missing-token") {
      toast.error("Missing verification token. Please sign up again.");
    } else if (error === "invalid-or-expired-token") {
      toast.error(
        "Your verification link has expired or is invalid. Please sign up again."
      );
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const parsed = EmailSchema.safeParse(email);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid email");
        return;
      }
      const payload = { email, role: "GUEST" };
      await api.post("/auth/signup", payload);
      toast.success("Verification email sent. Please check your inbox.");
      router.push(`/check-email?email=${encodeURIComponent(email)}&role=GUEST`);
    } catch (err: unknown) {
      const message =
        extractErrorMessage(err) || "Signup failed. Please try again later.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full animate-pulse" />
              <div className="relative bg-gradient-to-br from-rose-500 to-rose-600 p-4 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <AuthHeader
            title="Create your account"
            caption="Already have an account?"
            link="/signin"
            linkWord="Sign in"
          />
          <p className="text-center text-sm text-muted-foreground max-w-sm mx-auto">
            Create an account to book stays, leave reviews, and manage your
            reservations.
          </p>
        </div>

        <div>
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
                disabled={isLoading}
              />
            </div>

            <PrimaryButton
              type="submit"
              className="w-full h-11 px-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create account
                </span>
              )}
            </PrimaryButton>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <Button
            variant="outline"
            className="w-full h-11 border-2 hover:bg-accent/50 hover:border-accent-foreground/20 transition-all duration-200 font-medium"
            disabled={isLoading}
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </div>

        <div className="bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20 border border-rose-200/50 dark:border-rose-800/30 rounded-xl p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Why book with us?
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✓</span>
                <span>Curated listings from verified hosts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✓</span>
                <span>Flexible cancellation options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✓</span>
                <span>Secure bookings and 24/7 support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuestSignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-4 py-12 mb-10">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <GuestSignUpContent />
    </Suspense>
  );
}
