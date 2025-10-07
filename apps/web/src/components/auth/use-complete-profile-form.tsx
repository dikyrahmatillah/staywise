"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  CompleteRegistrationClientSchema,
  CompleteRegistrationClientInput,
} from "@/schemas";
import {
  validateAvatar,
  buildCompleteProfileFormData,
} from "./complete-profile.utils";
import { extractErrorMessage } from "@/lib/auth-error.utils";

interface UseCompleteProfileFormProps {
  token: string;
}

export function useCompleteProfileForm({ token }: UseCompleteProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const form = useForm<CompleteRegistrationClientInput>({
    // @ts-expect-error - Zod preprocess causes type mismatch with react-hook-form
    resolver: zodResolver(CompleteRegistrationClientSchema),
    defaultValues: { token },
  });

  const onSelectAvatar = useCallback((file?: File | null) => {
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    const error = validateAvatar(file);
    if (error) {
      toast.error(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  }, []);

  const onRemoveAvatar = useCallback(() => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

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

  return {
    form,
    fileInputRef,
    avatarFile,
    avatarPreview,
    isPasswordVisible,
    setIsPasswordVisible,
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
    onSelectAvatar,
    onRemoveAvatar,
    onSubmit,
  } as const;
}
