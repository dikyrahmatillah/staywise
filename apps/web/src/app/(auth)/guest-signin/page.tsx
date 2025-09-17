"use client";

import SignInForm from "@/components/auth/signin-form";
import AuthHeader from "@/components/auth/auth-header";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Separate component to handle searchParams (must be in Suspense boundary)
function GuestSignContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  return (
    <div className="flex items-center justify-center px-4 py-12 mb-10">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader
          title="Guest sign in"
          caption="Don't have an account?"
          link={`/guest-signup${
            callbackUrl !== "/dashboard"
              ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : ""
          }`}
          linkWord="Sign up"
        />
        <SignInForm
          title="Guest sign in"
          signupref={`/guest-signup${
            callbackUrl !== "/dashboard"
              ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
              : ""
          }`}
          callbackUrl={callbackUrl}
        />

        {/* Optional: Show where user will be redirected */}
        {callbackUrl !== "/dashboard" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              After signing in, you&apos;ll be redirected back to continue your
              booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GuestSignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-4 py-12 mb-10">
          <div className="w-full max-w-md space-y-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <GuestSignContent />
    </Suspense>
  );
}
