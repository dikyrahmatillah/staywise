import React from "react";
import { UseFormRegister } from "react-hook-form";

export interface ProfileUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  phone?: string | null;
  image?: string | null;
}

export interface ProfileEditFormProps {
  user: ProfileUser;
  onProfileUpdated?: () => void;
}

export interface PasswordInsights {
  checklist: PasswordCheckItem[];
  percent: number;
  tone: string;
  indicator: string;
  label: string;
}

export interface PasswordCheckItem {
  label: string;
  met: boolean;
}

export interface AvatarUploadProps {
  user: ProfileUser;
  avatarFile: File | null;
  avatarPreview: string | null;
  isUploading: boolean;
  onAvatarChange: (file: File | null, preview: string | null) => void;
}

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  register: UseFormRegister<any>;
}

export interface PasswordInputProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  showPassword: boolean;
  onToggleShow: () => void;
  disabled?: boolean;
  error?: string;
  register: UseFormRegister<any>;
}
