"use client";

import React from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";
import { validateFile, getInitials, getFullName } from "./utils";
import type { AvatarUploadProps } from "./types";

export function AvatarUpload({
  user,
  avatarPreview,
  isUploading,
  onAvatarChange,
}: AvatarUploadProps) {
  const onSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onAvatarChange(null, user.image || null);
      return;
    }

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      e.target.value = "";
      onAvatarChange(null, user.image || null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      onAvatarChange(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const fullName = getFullName(user.firstName, user.lastName);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-primary/10 via-background to-background p-6 text-center shadow-inner">
      <div className="flex flex-col items-center gap-4">
        <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <Avatar className="h-28 w-28 border-4 border-background bg-background shadow-xl">
            <AvatarImage
              src={avatarPreview || undefined}
              alt="Profile picture"
            />
            <AvatarFallback className="text-xl font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <Label
            htmlFor="avatar"
            className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground shadow-md transition hover:bg-primary hover:text-primary-foreground"
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Change photo</span>
          </Label>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{fullName}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Separator className="my-3" />
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>You can upload a JPG, PNG, or GIF. </p>
          <p>1 MB max.</p>
        </div>
      </div>
      <Input
        id="avatar"
        type="file"
        accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
        disabled={isUploading}
        onChange={onSelectAvatar}
        className="hidden"
      />
    </div>
  );
}
