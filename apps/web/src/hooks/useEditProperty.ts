"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useProperty } from "@/hooks/useProperty";
import useAuthToken from "@/hooks/useAuthToken";
import { getErrorMessage } from "@/lib/errors";
import type {
  Property,
  LocationValue,
  EditPropertyFormData,
} from "@/components/tenant/edit-property-form/types";
import { buildPropertyFormData } from "@/lib/property/build-property-form-data";

export function useEditProperty(propertyId: string) {
  const { data: session } = useSession();
  useAuthToken(session);
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    []
  );
  const [formData, setFormData] = useState<EditPropertyFormData>({
    name: "",
    description: "",
    country: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const apiKey = useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, []);

  const handleLocationSelect = (location: LocationValue) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      address: location.address || prev.address,
      city: location.city || prev.city,
      country: location.country || prev.country,
    }));
  };

  const {
    property: fetchedProperty,
    loading: propLoading,
    refetch,
  } = useProperty(propertyId);

  const refreshProperty = async () => {
    const result = await refetch();
    if (result.data) setProperty(result.data as unknown as Property);
  };

  const setPropertyCategory = (next: {
    propertyCategoryId?: string;
    propertyCategoryName?: string;
    customCategoryId?: string;
    customCategoryName?: string;
  }) => {
    setProperty((prev: Property | null) => {
      if (!prev) return prev;
      const propCat =
        next.propertyCategoryId === undefined || next.propertyCategoryId === ""
          ? undefined
          : next.propertyCategoryId;
      let customCat: string | undefined;
      let customCategoryObj: { id: string; name: string } | null | undefined;

      if (next.customCategoryId === undefined) {
        customCat = prev.customCategoryId;
        customCategoryObj = prev.CustomCategory;
      } else if (next.customCategoryId === "") {
        customCat = "";
        customCategoryObj = null;
      } else {
        customCat = next.customCategoryId;
        customCategoryObj = next.customCategoryName
          ? { id: next.customCategoryId, name: next.customCategoryName }
          : prev.CustomCategory;
      }

      return {
        ...prev,
        propertyCategoryId: propCat ?? prev.propertyCategoryId,
        customCategoryId: customCat,
        CustomCategory: customCategoryObj,
      } as Property;
    });
  };

  const setPropertyFacilities = (
    next: { facility: string; id?: string }[] | null
  ) => {
    setProperty((prev: Property | null) => {
      if (!prev) return prev;
      const updated = Array.isArray(next)
        ? next.map((f) => ({ facility: f.facility }))
        : [];
      return { ...prev, Facilities: updated } as Property;
    });
  };

  useEffect(() => {
    if (fetchedProperty) {
      setProperty(fetchedProperty as unknown as Property);
      setFormData({
        name: fetchedProperty.name || "",
        description: fetchedProperty.description || "",
        country: fetchedProperty.country || "",
        city: fetchedProperty.city || "",
        address: fetchedProperty.address || "",
        latitude: fetchedProperty.latitude?.toString() || "",
        longitude: fetchedProperty.longitude?.toString() || "",
      });
    }
  }, [fetchedProperty]);

  useEffect(() => {
    if (selectedImages.length === 0) {
      setSelectedImagePreviews([]);
      return;
    }
    const previews = selectedImages.map((file) => URL.createObjectURL(file));
    setSelectedImagePreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedImages]);

  const removeExistingPicture = (id: string) => {
    setProperty((prev: Property | null) => {
      if (!prev) return prev;
      const updatedPictures = (prev.Pictures || []).filter(
        (p: { id: string }) => p.id !== id
      );
      return { ...prev, Pictures: updatedPictures } as Property;
    });
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImagePreviews((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxGuests" ? parseInt(value) || 1 : value,
    }));
  };

  const queryClient = useQueryClient();
  const updateMutation = useMutation<{ data: Property }, unknown, FormData>({
    mutationFn: async (data: FormData) => {
      const res = await api.put<{ data: Property }>(
        `/properties/id/${propertyId}`,
        data
      );
      return res.data;
    },
    onSuccess: (res) => {
      toast.success("Property updated successfully!");
      setProperty(res.data);
      queryClient.setQueryData(["property", propertyId], res.data);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to update property"));
    },
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session?.user?.accessToken) {
      toast.error("Please login to continue");
      return;
    }
    const fd = buildPropertyFormData(formData, property, selectedImages);
    return updateMutation.mutateAsync(fd);
  };

  return {
    property,
    loading: propLoading,
    isSubmitting: updateMutation.status === "pending",
    formData,
    selectedImages,
    selectedImagePreviews,
    apiKey,
    setFormData,
    handleInputChange,
    handleLocationSelect,
    setSelectedImages,
    removeExistingPicture,
    removeSelectedImage,
    handleSubmit,
    updateProperty: updateMutation.mutateAsync,
    refreshProperty,
    setPropertyFacilities,
    setPropertyCategory,
  } as const;
}
