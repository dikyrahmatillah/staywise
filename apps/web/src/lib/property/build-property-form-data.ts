import type {
  Property,
  EditPropertyFormData,
} from "@/components/tenant/edit-property-form/types";

export function buildPropertyFormData(
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

  if (property?.propertyCategoryId)
    fd.append("propertyCategoryId", property.propertyCategoryId);

  fd.append("customCategoryId", property?.customCategoryId ?? "");

  if (property?.Facilities) {
    fd.append(
      "facilities",
      JSON.stringify(
        property.Facilities.map(
          (facility: { id: string; facility: string }) => ({
            facility: facility.facility,
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
