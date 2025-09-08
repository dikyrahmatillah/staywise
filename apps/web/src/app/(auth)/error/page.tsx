"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function AuthErrorInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration. Please contact support.";
      case "AccessDenied":
        return "Access was denied. You may not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">
            Authentication Error
          </h1>
          <p className="text-gray-600 mt-2">{getErrorMessage(error)}</p>
          {error && (
            <p className="text-sm text-gray-500 mt-2">Error code: {error}</p>
          )}
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/signin">Try Again</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <AuthErrorInner />
    </Suspense>
  );
}
