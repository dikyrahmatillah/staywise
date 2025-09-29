"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdateUserSchema, UpdateUserInput } from "@repo/schemas";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { AvatarUpload } from "./avatar-upload";
import { ProfileFormSections } from "./profile-form-sections";
import type { ProfileEditFormProps } from "./types";

export function ProfileEditForm({
  user,
  onProfileUpdated,
}: ProfileEditFormProps) {
  const { data: session } = useSession();
  const { updateProfile } = useUserProfile();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.image || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email,
    },
  });

  const handleAvatarChange = useCallback(
    (file: File | null, preview: string | null) => {
      setAvatarFile(file);
      setAvatarPreview(preview);
    },
    []
  );

  const onSubmit = useCallback(
    async (data: UpdateUserInput) => {
      if (!session?.user?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      try {
        setIsUploading(true);

        const formData = new FormData();
        if (data.firstName) formData.append("firstName", data.firstName);
        if (data.lastName) formData.append("lastName", data.lastName);
        if (data.phone) formData.append("phone", data.phone);
        if (data.email) formData.append("email", data.email);
        if (avatarFile) formData.append("image", avatarFile);

        await updateProfile(formData);
        onProfileUpdated?.();
      } finally {
        setIsUploading(false);
      }
    },
    [avatarFile, onProfileUpdated, session?.user?.accessToken, updateProfile]
  );

  const accountBadgeLabel = useMemo(() => {
    const role = (session?.user as { role?: string } | undefined)?.role;
    return role ? `${role} account` : "Active member";
  }, [session?.user]);

  const handleCancel = () => {
    reset();
    setAvatarPreview(user.image || null);
    setAvatarFile(null);
  };

  const isDisabled = isSubmitting || isUploading;

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-border/50 bg-background/95 shadow-xl ring-1 ring-border/40 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 " />
        <CardHeader className="relative z-[1] pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold">
                Personal profile
              </CardTitle>
              <CardDescription className="max-w-xl text-muted-foreground/80">
                Keep your account details polished so each stay feels perfectly
                tailored to you.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="flex w-fit items-center gap-2 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary md:self-center"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {accountBadgeLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative z-[1] space-y-8 pt-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
              <AvatarUpload
                user={user}
                avatarFile={avatarFile}
                avatarPreview={avatarPreview}
                isUploading={isUploading}
                onAvatarChange={handleAvatarChange}
              />

              <ProfileFormSections
                register={register}
                errors={errors}
                disabled={isDisabled}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isDisabled}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isDisabled}
                className="sm:min-w-[140px]"
              >
                {isDisabled ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
