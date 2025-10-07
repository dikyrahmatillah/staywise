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
        setError("Your verification link is invalid or has expired.");
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

          <div className="rounded-md border p-4 bg-background">
            <p className="text-sm text-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <Link
                href="/guest-signup"
                className="inline-block px-4 py-2 bg-rose-500 text-white rounded-md"
              >
                Get a new token
              </Link>
              <button
                className="inline-block px-4 py-2 border rounded-md"
                onClick={() => router.push("/")}
              >
                Back to home
              </button>
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
