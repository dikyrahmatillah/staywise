"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import type { Room, BedType } from "@/types/room";
import type { CreateRoomInput, UpdateRoomInput } from "@/schemas";
import { updateRoomSchema } from "@/schemas";
import { toast } from "sonner";
import type { RoomFormErrors, RoomFormState } from "./types";
import {
  initialRoomFormState,
  deriveFormStateFromRoom,
  sanitizeNumericInput,
  validateImage,
  toUpdateRoomSchemaInput,
  buildRoomFormData,
  truncateFileName as truncateFileNameHelper,
} from "./utils";

type UseRoomFormParams = {
  room?: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    data: CreateRoomInput | UpdateRoomInput | FormData
  ) => Promise<void>;
};

export function useRoomForm({
  room,
  open,
  onOpenChange,
  onSubmit,
}: UseRoomFormParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RoomFormState>(
    initialRoomFormState()
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<RoomFormErrors>({});

  useEffect(() => {
    if (room) {
      setFormData(deriveFormStateFromRoom(room));
      setPreviewUrl(room.imageUrl || "");
    } else {
      setFormData(initialRoomFormState());
      setPreviewUrl("");
    }
    setImageFile(null);
  }, [room, open]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: sanitizeNumericInput(name, value),
        } as RoomFormState)
    );
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (value: BedType) => {
    setFormData((prev) => ({ ...prev, bedType: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const imageError = validateImage(file);
    if (imageError) {
      setErrors((prev) => ({ ...prev, imageUrl: imageError }));
      setImageFile(null);
      return;
    }
    setImageFile(file);
    if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: "" }));
  };

  const validateForm = () => {
    try {
      const payload = toUpdateRoomSchemaInput(formData);
      const validatedData = updateRoomSchema.parse(payload) as UpdateRoomInput;
      setErrors({});
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: RoomFormErrors = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      }
      return null;
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      const imageError = validateImage(imageFile);
      if (imageError) {
        setErrors((prev) => ({ ...prev, imageUrl: imageError }));
        toast.error("Please fix the form errors");
        return;
      }
    }

    const validatedData = validateForm();
    if (!validatedData) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      if (imageFile) {
        const form = buildRoomFormData(
          validatedData as CreateRoomInput | UpdateRoomInput,
          imageFile,
          formData.price
        );
        await onSubmit(form);
      } else {
        await onSubmit(validatedData);
      }
      setFormData(initialRoomFormState());
      setErrors({});
      onOpenChange(false);
    } catch (err) {
      console.error("Error submitting room form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = () => fileInputRef.current?.click();
  const chooseFileClick = () => fileInputRef.current?.click();

  const truncateFileName = truncateFileNameHelper;

  return {
    isSubmitting,
    formData,
    setFormData,
    imageFile,
    setImageFile,
    previewUrl,
    fileInputRef,
    errors,
    setErrors,
    handleInputChange,
    handleSelectChange,
    handleFileChange,
    submit,
    pickImage,
    chooseFileClick,
    truncateFileName,
  };
}
