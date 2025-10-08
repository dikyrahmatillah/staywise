"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import AuthHeader from "@/components/auth/auth-header";
import InvalidTokenCard from "@/components/auth/invalid-token-card";
import { Ellipsis } from "@/components/ui/ellipsis";
import { useValidateToken } from "@/hooks/useValidateToken";

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const { isLoading, isValid, error } = useValidateToken(
    token,
    "EMAIL_VERIFICATION"
  );

  useEffect(() => {
    if (!token) {
      router.push("/guest-signup?error=missing-token");
    }
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
      <InvalidTokenCard
        title="Invalid or expired link"
        caption="Need a new token?"
        linkHref="/guest-signup"
        linkWord="Get a new token"
        error={error}
      />
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
