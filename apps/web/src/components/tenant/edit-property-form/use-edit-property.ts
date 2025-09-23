"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useProperty } from "@/hooks/useProperty";

import type { Property, LocationValue, EditPropertyFormData } from "./types";

export function useEditProperty(propertyId: string) {
  const { data: session } = useSession();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    maxGuests: 1,
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

  const { property: fetchedProperty, loading: propLoading } =
    useProperty(propertyId);

  useEffect(() => {
    setLoading(Boolean(propLoading));
  }, [propLoading]);

  useEffect(() => {
    if (fetchedProperty) {
      setProperty(fetchedProperty);
      setFormData({
        name: fetchedProperty.name || "",
        description: fetchedProperty.description || "",
        country: fetchedProperty.country || "",
        city: fetchedProperty.city || "",
        address: fetchedProperty.address || "",
        maxGuests: fetchedProperty.maxGuests || 1,
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
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.accessToken) {
      toast.error("Please login to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("maxGuests", formData.maxGuests.toString());
      if (formData.latitude)
        formDataToSend.append("latitude", formData.latitude);
      if (formData.longitude)
        formDataToSend.append("longitude", formData.longitude);

      if (property?.Pictures) {
        formDataToSend.append(
          "existingPictures",
          JSON.stringify(
            property.Pictures.map(
              (pic: {
                id: string;
                imageUrl: string;
                note?: string | null;
              }) => ({
                id: pic.id,
                imageUrl: pic.imageUrl,
                note: pic.note ?? null,
              })
            )
          )
        );
      }

      selectedImages.forEach((image) => {
        formDataToSend.append("propertyImages", image);
      });

      if (selectedImages.length > 0) {
        const picturesData = selectedImages.map((_, index) => ({
          fileIndex: index,
          note: null as string | null,
        }));
        formDataToSend.append("propertyPictures", JSON.stringify(picturesData));
      }

      const response = await api.put(
        `/properties/id/${propertyId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Property updated successfully!");
      const updatedProperty = response.data.data as Property;
      setProperty(updatedProperty);
      setSelectedImages([]);
    } catch (error: unknown) {
      console.error("Error updating property:", error);
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to update property";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    property,
    loading,
    isSubmitting,
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
  } as const;
}
