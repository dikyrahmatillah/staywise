"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Ellipsis from "@/components/ui/ellipsis";

function OAuthRedirectContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const roleParam = (searchParams.get("role") || "").toUpperCase();
  const error = searchParams.get("error");

  useEffect(() => {
    toast.dismiss();

    if (error) {
      toast.error("Authentication failed. Please try again.");
      router.replace("/signin");
      return;
    }

    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Authentication failed. Please try again.");
      router.replace("/signin");
      return;
    }

    if (status === "authenticated" && session?.user) {
      toast.success(`Welcome back, ${session.user.name || "User"}!`);

      setTimeout(() => {
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
      }, 800);
    }
  }, [status, session, router, callbackUrl, roleParam, error]);

  return (
    <div className="flex items-center justify-center h-48">
      <div className="text-sm text-muted-foreground">
        <Ellipsis size={6} />
      </div>
    </div>
  );
}

export default function OAuthRedirectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-48">
          <div className="text-sm text-muted-foreground">
            <Ellipsis size={6} />
          </div>
        </div>
      }
    >
      <OAuthRedirectContent />
    </Suspense>
  );
}
