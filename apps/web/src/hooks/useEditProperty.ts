"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

function buildFormData(
  formData: EditPropertyFormData,
  property: Property | null,
  selectedImages: File[]
): FormData {
  const fd = new FormData();
  fd.append("name", formData.name);
  fd.append("description", formData.description);
  fd.append("country", formData.country);
  fd.append("city", formData.city);
  fd.append("address", formData.address);
  if (formData.latitude) fd.append("latitude", formData.latitude);
  if (formData.longitude) fd.append("longitude", formData.longitude);

  if (property?.propertyCategoryId) {
    fd.append("propertyCategoryId", property.propertyCategoryId);
  }
  if (property?.customCategoryId) {
    fd.append("customCategoryId", property.customCategoryId);
  }

  if (property?.Facilities) {
    fd.append(
      "facilities",
      JSON.stringify(
        property.Facilities.map(
          (facility: {
            id: string;
            facility: string;
            note?: string | null;
          }) => ({
            facility: facility.facility,
            note: facility.note,
          })
        )
      )
    );
  }

  if (property?.Pictures) {
    fd.append(
      "existingPictures",
      JSON.stringify(
        property.Pictures.map(
          (pic: { id: string; imageUrl: string; note?: string | null }) => ({
            id: pic.id,
            imageUrl: pic.imageUrl,
            note: pic.note ?? null,
          })
        )
      )
    );
  }

  selectedImages.forEach((image) => fd.append("propertyImages", image));

  if (selectedImages.length > 0) {
    const picturesData = selectedImages.map((_, index) => ({
      fileIndex: index,
      note: null as string | null,
    }));
    fd.append("propertyPictures", JSON.stringify(picturesData));
  }

  return fd;
}

export function useEditProperty(propertyId: string) {
  const { data: session } = useSession();
  useAuthToken(session);

  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedImagePreviews, setSelectedImagePreviews] = useState<string[]>(
    []
  );
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
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
    if (result.data) {
      setProperty(result.data);
    }
  };

  const setPropertyFacilities = (
    next: { facility: string; note?: string | null; id?: string }[] | null
  ) => {
    setProperty((prev: Property | null) => {
      if (!prev) return prev;
      const updated = Array.isArray(next)
        ? next.map((f) => ({ facility: f.facility, note: f.note ?? null }))
        : [];
      return { ...prev, Facilities: updated } as Property;
    });
  };

  useEffect(() => {
    if (fetchedProperty) {
      setProperty(fetchedProperty);
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
      const msg = getErrorMessage(err, "Failed to update property");
      toast.error(msg);
    },
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!session?.user?.accessToken) {
      toast.error("Please login to continue");
      return;
    }
    const fd = buildFormData(formData, property, selectedImages);
    return updateMutation.mutateAsync(fd);
  };

  return {
    property,
    loading: propLoading,
    isSubmitting: updateMutation.status === "pending",
    formData,
    selectedImages,
    selectedImagePreviews,
    hiddenFileInput,
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
  } as const;
}
