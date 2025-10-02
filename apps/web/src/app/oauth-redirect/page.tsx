"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

function OAuthRedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const roleParam = (searchParams.get("role") || "").toUpperCase();

  useEffect(() => {
    if (status === "loading") return;

    if (roleParam === "TENANT") {
      if (session?.user?.role === "TENANT") {
        router.replace("/dashboard");
        return;
      }

      const tenantSignupUrl = `/tenant-signup?callbackUrl=${encodeURIComponent(
        callbackUrl
      )}`;
      router.replace(tenantSignupUrl);
      return;
    }

    router.replace(callbackUrl);
  }, [status, session, router, callbackUrl, roleParam]);

  return (
    <div className="flex items-center justify-center h-48">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  );
}

export default function OAuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-48">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <OAuthRedirectContent />
    </Suspense>
  );
}
