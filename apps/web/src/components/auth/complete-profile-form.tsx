"use client";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import PrimaryButton from "@/components/ui/primary-button";
import { Label } from "@/components/ui/label";
import AvatarInput from "./avatar-input";
import { useCompleteProfileForm } from "./use-complete-profile-form";

interface Props {
  token: string;
}

export default function CompleteProfileForm({ token }: Props) {
  const {
    form,
    fileInputRef,
    avatarPreview,
    isPasswordVisible,
    setIsPasswordVisible,
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
    onSelectAvatar,
    onRemoveAvatar,
    onSubmit,
  } = useCompleteProfileForm({ token });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    // @ts-expect-error - Type mismatch due to Zod preprocess
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={token} {...register("token")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First </Label>
          <Input
            id="firstName"
            placeholder="Your first name"
            disabled={isSubmitting}
            required
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last name
            <span className="text-xs text-muted-foreground font-normal">
              (Optional)
            </span>
          </Label>
          <Input
            id="lastName"
            placeholder="Your last name"
            disabled={isSubmitting}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone number{" "}
          <span className="text-xs text-muted-foreground font-normal">
            (Optional)
          </span>
        </Label>
        <Input
          id="phone"
          placeholder="+62 8xx xxxx xxxx"
          disabled={isSubmitting}
          className="w-full"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            placeholder="••••••••"
            type={isPasswordVisible ? "text" : "password"}
            disabled={isSubmitting}
            required
            {...register("password")}
          />
          <button
            type="button"
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            onClick={() => setIsPasswordVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            disabled={isSubmitting}
          >
            {isPasswordVisible ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FiEye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type={isConfirmPasswordVisible ? "text" : "password"}
            disabled={isSubmitting}
            required
            {...register("confirmPassword")}
          />
          <button
            type="button"
            aria-label={
              isConfirmPasswordVisible ? "Hide password" : "Show password"
            }
            onClick={() => setIsConfirmPasswordVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            disabled={isSubmitting}
          >
            {isConfirmPasswordVisible ? (
              <FiEyeOff className="w-4 h-4" />
            ) : (
              <FiEye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">
          Profile Picture{" "}
          <span className="text-xs text-muted-foreground font-normal">
            (Optional)
          </span>
        </Label>

        <AvatarInput
          avatarPreview={avatarPreview}
          isSubmitting={isSubmitting}
          fileInputRef={fileInputRef}
          onFileChange={onSelectAvatar}
          onRemove={onRemoveAvatar}
        />

        <p className="text-xs text-muted-foreground">
          Max 1MB. Supports JPG, JPEG, PNG, GIF formats.
        </p>
      </div>
      <PrimaryButton
        type="submit"
        className="w-full h-11"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Complete Registration"}
      </PrimaryButton>
    </form>
  );
}
