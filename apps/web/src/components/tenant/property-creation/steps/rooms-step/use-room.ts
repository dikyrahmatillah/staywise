import { useCallback, useEffect, useRef, useState } from "react";
import { RoomFormData, DEFAULT_ROOM_FORM } from "./types";

export function useRoomForm() {
  const [formData, setFormData] = useState<RoomFormData>(DEFAULT_ROOM_FORM);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFieldChange = useCallback(
    (field: string, value: string | number) => {
      setFormData((prev) => {
        let nextValue: string | number = value;

        if (field === "basePrice") {
          const n = typeof value === "string" ? parseFloat(value) : value;
          nextValue = Number.isNaN(n) ? 0 : n;
        }

        if (field === "capacity" || field === "bedCount") {
          const n = typeof value === "string" ? parseInt(value) : value;
          nextValue = Number.isNaN(n) ? 1 : n;
        }

        return {
          ...prev,
          [field]: nextValue,
        };
      });
    },
    []
  );

  const handleImageSelect = useCallback((files: File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: previewUrl,
    }));
  }, []);

  const handleImageRemove = useCallback(() => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData((prev) => ({
      ...prev,
      imageFile: undefined,
      imagePreview: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [formData.imagePreview]);

  const resetForm = useCallback(() => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData(DEFAULT_ROOM_FORM);
    setEditingIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [formData.imagePreview]);

  const loadRoom = useCallback(
    (room: RoomFormData, index: number) => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      const preview = room.imageFile
        ? URL.createObjectURL(room.imageFile)
        : room.imagePreview || undefined;

      setFormData({
        name: room.name || "",
        description: room.description || "",
        basePrice: room.basePrice || 0,
        capacity: room.capacity || 1,
        bedType: room.bedType || "KING",
        bedCount: room.bedCount || 1,
        imageFile: room.imageFile,
        imagePreview: preview,
      });

      setEditingIndex(index);
    },
    [formData.imagePreview]
  );

  const isFormValid = useCallback(() => {
    return Boolean(
      formData.name && formData.basePrice && formData.basePrice > 0
    );
  }, [formData.name, formData.basePrice]);

  return {
    formData,
    editingIndex,
    fileInputRef,
    handleFieldChange,
    handleImageSelect,
    handleImageRemove,
    resetForm,
    loadRoom,
    isFormValid,
  };
}

export function useRoomPreviews(rooms: RoomFormData[]) {
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const previewsRef = useRef<Record<number, string>>({});
  const roomBlobRef = useRef<Record<number, string>>({});

  useEffect(() => {
    const next: Record<number, string> = {};
    const usedIndices = new Set<number>();

    rooms.forEach((room, idx) => {
      if (room.imagePreview) {
        next[idx] = room.imagePreview;
        if (room.imageFile) {
          roomBlobRef.current[idx] = room.imagePreview as string;
        }
      } else if (room.imageFile) {
        if (previewsRef.current[idx]) {
          next[idx] = previewsRef.current[idx];
        } else {
          const url = URL.createObjectURL(room.imageFile);
          previewsRef.current[idx] = url;
          next[idx] = url;
        }
      }
      usedIndices.add(idx);
    });

    Object.keys(previewsRef.current).forEach((k) => {
      const i = Number(k);
      if (!usedIndices.has(i)) {
        URL.revokeObjectURL(previewsRef.current[i]);
        delete previewsRef.current[i];
      }
    });

    Object.keys(roomBlobRef.current).forEach((k) => {
      const i = Number(k);
      if (!usedIndices.has(i)) {
        try {
          URL.revokeObjectURL(roomBlobRef.current[i]);
        } catch {}
        delete roomBlobRef.current[i];
      }
    });

    setPreviews(next);
  }, [rooms]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((url) => {
        URL.revokeObjectURL(url);
      });
      previewsRef.current = {};
    };
  }, []);

  return previews;
}
