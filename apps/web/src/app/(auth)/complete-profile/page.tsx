import React from "react";
import CompleteProfileForm from "@/components/auth/complete-profile-form";
import AuthHeader from "@/components/auth/auth-header";

interface PageProps {
  searchParams: { token?: string };
}

export default function CompleteProfilePage({ searchParams }: PageProps) {
  const token = searchParams?.token || "";
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
