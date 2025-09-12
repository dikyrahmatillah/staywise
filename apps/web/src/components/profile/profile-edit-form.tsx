"use client";

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpdateUserSchema, UpdateUserInput } from "@repo/schemas";
import api from "@/lib/axios";
import { Camera, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProfileEditFormProps {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  };
  onProfileUpdated?: () => void;
}

export function ProfileEditForm({
  user,
  onProfileUpdated,
}: ProfileEditFormProps) {
  const { data: session } = useSession();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
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

  const validateFile = (file: File): string | null => {
    if (file.size > 1024 * 1024) {
      return "File size must be less than 1MB";
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return "Only JPG, JPEG, PNG, and GIF files are allowed";
    }

    return null;
  };

  const onSelectAvatar = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setAvatarFile(null);
        setAvatarPreview(user.avatarUrl || null);
        return;
      }

      const error = validateFile(file);
      if (error) {
        toast.error(error);
        e.target.value = "";
        setAvatarFile(null);
        setAvatarPreview(user.avatarUrl || null);
        return;
      }

      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [user.avatarUrl]
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

        if (avatarFile) {
          formData.append("avatarUrl", avatarFile);
        }

        await api.put("/auth/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        toast.success("Profile updated successfully!");

        if (onProfileUpdated) {
          onProfileUpdated();
        }
      } catch (error: unknown) {
        console.error("Profile update error:", error);
        let errorMessage = "Failed to update profile";

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          errorMessage =
            axiosError.response?.data?.message || "Failed to update profile";
        }

        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    [avatarFile, onProfileUpdated, session?.user?.accessToken]
  );

  const getInitials = (firstName: string, lastName?: string | null) => {
    return `${firstName.charAt(0)}${
      lastName ? lastName.charAt(0) : ""
    }`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarPreview || undefined}
                  alt="Profile picture"
                />
                <AvatarFallback className="text-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      <Camera className="h-4 w-4" />
                      Change photo
                    </div>
                  </Label>
                </div>
                <Input
                  id="avatar"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
                  disabled={isSubmitting || isUploading}
                  onChange={onSelectAvatar}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Max 1MB. JPG, JPEG, PNG, GIF.
                </p>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  disabled={isSubmitting || isUploading}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  disabled={isSubmitting || isUploading}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                disabled={isSubmitting || isUploading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                disabled={isSubmitting || isUploading}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="min-w-[100px]"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
