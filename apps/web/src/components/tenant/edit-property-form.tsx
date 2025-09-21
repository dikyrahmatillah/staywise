"use client";

import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { BasicInfoCard } from "./edit-property-form/basic-info-card";
import { LocationCard } from "./edit-property-form/location-card";
import { ImagesCard } from "./edit-property-form/images-card";
import { useEditProperty } from "./edit-property-form/use-edit-property";

interface EditPropertyFormProps {
  propertyId: string;
}

export function EditPropertyForm({ propertyId }: EditPropertyFormProps) {
  const {
    property,
    loading,
    isSubmitting,
    formData,
    selectedImages,
    selectedImagePreviews,
    hiddenFileInput,
    apiKey,
    handleInputChange,
    handleLocationSelect,
    setSelectedImages,
    removeExistingPicture,
    removeSelectedImage,
    handleSubmit,
  } = useEditProperty(propertyId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Property not found</h3>
        <p className="text-muted-foreground">
          The property you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to access it.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="text-muted-foreground">
            Update your property information and details
          </p>
        </div>
        <Button form="edit-property-form" type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <form
        id="edit-property-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <BasicInfoCard
            values={{
              name: formData.name,
              description: formData.description,
              maxGuests: formData.maxGuests,
            }}
            onChange={handleInputChange}
          />

          <LocationCard
            apiKey={apiKey}
            values={{
              country: formData.country,
              city: formData.city,
              address: formData.address,
              latitude: formData.latitude,
              longitude: formData.longitude,
            }}
            onChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        <ImagesCard
          existingPictures={property.Pictures}
          onRemoveExisting={removeExistingPicture}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          selectedImagePreviews={selectedImagePreviews}
          onRemoveSelected={removeSelectedImage}
          hiddenFileInput={hiddenFileInput}
        />
      </form>
    </div>
  );
}
