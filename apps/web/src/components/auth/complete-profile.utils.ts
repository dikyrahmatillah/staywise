import { CompleteRegistrationClientInput } from "@repo/schemas";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
] as const;
export const MAX_AVATAR_BYTES = 1 * 1024 * 1024; // 1MB
export type AllowedImageMime = (typeof ALLOWED_IMAGE_TYPES)[number];

export function validateAvatar(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageMime)) {
    return "Only JPG, JPEG, PNG or GIF allowed.";
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return "File must be <= 1MB.";
  }
  return null;
}

export function buildCompleteProfileFormData(
  token: string,
  data: CompleteRegistrationClientInput,
  avatarFile: File | null
) {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("firstName", data.firstName.trim());
  if (data.lastName?.trim()) formData.append("lastName", data.lastName.trim());
  if (data.phone?.trim()) formData.append("phone", data.phone.trim());
  formData.append("password", data.password);
  if (avatarFile) formData.append("avatarUrl", avatarFile);
  return formData;
}
