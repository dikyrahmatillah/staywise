"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import {
  CompleteRegistrationClientSchema,
  CompleteRegistrationClientInput,
} from "@repo/schemas";
import {
  validateAvatar,
  buildCompleteProfileFormData,
} from "./complete-profile.utils";
import { extractErrorMessage } from "@/lib/auth-error.utils";

interface Props {
  token: string;
}

export default function CompleteProfileForm({ token }: Props) {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteRegistrationClientInput>({
    resolver: zodResolver(CompleteRegistrationClientSchema),
    defaultValues: { token },
  });

  const onSelectAvatar = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        setAvatarFile(null);
        return;
      }
      const error = validateAvatar(file);
      if (error) {
        toast.error(error);
        e.target.value = "";
        setAvatarFile(null);
        return;
      }
      setAvatarFile(file);
    },
    []
  );

  const onSubmit = useCallback(
    async (data: CompleteRegistrationClientInput) => {
      if (!token) {
        toast.error("Missing token. Restart signup.");
        router.replace("/guest-signup");
        return;
      }
      try {
        const formData = buildCompleteProfileFormData(token, data, avatarFile);
        await api.post("/auth/signup/complete", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Registration completed. Please sign in.");
        router.replace("/signin");
      } catch (err: unknown) {
        const message =
          extractErrorMessage(err) || "Failed to complete registration";
        toast.error(message);
      }
    },
    [avatarFile, router, token]
  );

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={token} {...register("token")} />
      <div className="space-y-2">
        <Label htmlFor="firstName">First name</Label>
        <Input
          id="firstName"
          disabled={isSubmitting}
          required
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last name</Label>
        <Input
          id="lastName"
          disabled={isSubmitting}
          {...register("lastName")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" disabled={isSubmitting} {...register("phone")} />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          disabled={isSubmitting}
          required
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          disabled={isSubmitting}
          required
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Picture</Label>
        <Input
          id="avatar"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
          disabled={isSubmitting}
          onChange={onSelectAvatar}
        />
        <p className="text-xs text-muted-foreground">
          Max 1MB. JPG, JPEG, PNG, GIF.
        </p>
      </div>
      <Button
        type="submit"
        className="w-full bg-rose-500 hover:bg-rose-600 text-white cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Complete Registration"}
      </Button>
    </form>
  );
}
