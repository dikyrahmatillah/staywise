"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import AuthHeader from "@/components/auth/auth-header";
import { Ellipsis } from "@/components/ui/ellipsis";
import { api } from "@/lib/axios";
import Link from "next/link";

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/guest-signup?error=missing-token");
      return;
    }

    let mounted = true;

    const validate = async () => {
      try {
        await api.get("/auth/validate-token", {
          params: { token, type: "EMAIL_VERIFICATION" },
        });
        if (!mounted) return;
        setIsValid(true);
      } catch {
        if (!mounted) return;
        setError(
          "Your verification link appears to be invalid or has expired."
        );
        setIsValid(false);
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    validate();

    return () => {
      mounted = false;
    };
  }, [token, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-12 mb-10">
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
      <div className="flex items-center justify-center px-4 py-12 mb-10">
        <div className="w-full max-w-md space-y-8">
          <AuthHeader
            title="Invalid or expired link"
            caption="Need a new token?"
            link="/guest-signup"
            linkWord="Restart"
          />

          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-base font-semibold text-foreground">
                  Verification Failed
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {error}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
                <Link
                  href="/guest-signup"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Get a new token
                </Link>
                <button
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium rounded-lg transition-colors"
                  onClick={() => router.push("/")}
                >
                  Back to home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Complete your profile"
          caption="Need a new token?"
          link="/guest-signup"
          linkWord="Restart"
        />
        <CompleteProfileForm token={token} />
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-4 py-12 mb-10">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center gap-4">
              <Ellipsis size={8} color="var(--tw-text-opacity, #ef4444)" />
              <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
          </div>
        </div>
      }
    >
      <CompleteProfileContent />
    </Suspense>
  );
}
