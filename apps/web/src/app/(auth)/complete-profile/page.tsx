import React from "react";
import { redirect } from "next/navigation";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import AuthHeader from "@/components/auth/auth-header";
import { api } from "@/lib/axios";

interface PageProps {
  searchParams: { token?: string };
}

async function validateToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    await api.get("/auth/validate-token", {
      params: { token, type: "EMAIL_VERIFICATION" },
    });
    return true;
  } catch {
    return false;
  }
}

export default async function CompleteProfilePage({ searchParams }: PageProps) {
  const token = searchParams?.token || "";
  if (!token) redirect("/guest-signup?error=missing-token");

  const isValid = await validateToken(token);
  if (!isValid) redirect("/guest-signup?error=invalid-or-expired-token");

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
