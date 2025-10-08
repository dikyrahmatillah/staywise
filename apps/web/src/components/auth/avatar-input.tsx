"use client";

import React, { ChangeEvent } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { Input } from "@/components/ui/input";

interface AvatarInputProps {
  avatarPreview: string | null;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (file?: File | null) => void;
  onRemove: () => void;
}

export function AvatarInput({
  avatarPreview,
  isSubmitting,
  fileInputRef,
  onFileChange,
  onRemove,
}: AvatarInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileChange(file);
  };

  if (avatarPreview) {
    return (
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-muted mx-auto">
            <Image
              src={avatarPreview}
              alt="Avatar preview"
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer"
            aria-label="Remove avatar"
            disabled={isSubmitting}
          >
            <FiX className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Input
      ref={fileInputRef}
      id="avatar"
      type="file"
      accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
      disabled={isSubmitting}
      onChange={handleChange}
      className="cursor-pointer"
    />
  );
}

export default AvatarInput;
