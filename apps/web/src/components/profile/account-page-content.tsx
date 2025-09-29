"use client";

import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { useUserProfile } from "@/hooks/useUserProfile";
import { AlertCircle } from "lucide-react";
import Ellipsis from "@/components/ui/ellipsis";

export function AccountPageContent() {
  const { profile, loading, error, refetch } = useUserProfile();

  if (loading) {
    return (
      <div className="border-l flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Ellipsis className="text-muted-foreground" />
          <span className="text-muted-foreground">Loading profile</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="border-l p-6">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700">
            {error || "Failed to load profile data"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileEditForm user={profile} onProfileUpdated={refetch} />
      <ChangePasswordForm />
    </div>
  );
}
