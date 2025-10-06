"use client";

import { Button } from "@/components/ui/button";
import Ellipsis from "@/components/ui/ellipsis";
import { Save, Loader2, Building2 } from "lucide-react";
import { BasicInfoCard } from "./edit-property-form/basic-info-card";
import { LocationCard } from "./edit-property-form/location-card";
import { ImagesCard } from "./edit-property-form/images-card";
import { CategoryCard } from "./edit-property-form/category-card";
import { FacilitiesCard } from "./edit-property-form/facilities-card";
import { useEditProperty } from "@/hooks/useEditProperty";

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
    apiKey,
    handleInputChange,
    handleLocationSelect,
    setSelectedImages,
    removeExistingPicture,
    removeSelectedImage,
    handleSubmit,
    setPropertyFacilities,
    setPropertyCategory,
  } = useEditProperty(propertyId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Ellipsis size={8} />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-16">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Property not found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          The property you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have permission to access it.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container max-w-6xl mx-auto space-y-8">
        <div className="bg-transparent rounded-xl p-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Edit Property
              </h1>
              <p className="text-muted-foreground">
                Update your property information and attract more guests
              </p>
            </div>
            <Button
              form="edit-property-form"
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="min-w-[140px] shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <form
          id="edit-property-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-6">
            <BasicInfoCard
              values={{
                name: formData.name,
                description: formData.description,
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

            <CategoryCard property={property} onChange={setPropertyCategory} />

            <FacilitiesCard
              property={property}
              onChange={(next) =>
                setPropertyFacilities(
                  next.map((f) => ({ facility: f.facility }))
                )
              }
            />

            <ImagesCard
              existingPictures={property.Pictures}
              onRemoveExisting={removeExistingPicture}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              selectedImagePreviews={selectedImagePreviews}
              onRemoveSelected={removeSelectedImage}
            />
          </div>
        </form>

        <div className="flex justify-center">
          <Button
            form="edit-property-form"
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="min-w-[200px] shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
