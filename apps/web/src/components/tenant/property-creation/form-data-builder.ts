import type { PropertyFormData, PictureFormData, RoomFormData } from "./types";

export const buildPropertyFormData = (
  formData: PropertyFormData,
  tenantId: string
): FormData => {
  const formDataToSend = new FormData();

  appendBasicPropertyInfo(formDataToSend, formData, tenantId);
  appendLocationCoordinates(formDataToSend, formData);
  appendPropertyCategories(formDataToSend, formData);
  appendFacilities(formDataToSend, formData);
  appendPropertyPictures(formDataToSend, formData);
  appendRooms(formDataToSend, formData);

  return formDataToSend;
};

const appendBasicPropertyInfo = (
  formData: FormData,
  propertyData: PropertyFormData,
  tenantId: string
): void => {
  formData.append("tenantId", tenantId);
  formData.append("name", propertyData.name || "");
  formData.append("description", propertyData.description || "");
  formData.append("country", propertyData.country || "");
  formData.append("city", propertyData.city || "");
  formData.append("address", propertyData.address || "");
};

const appendLocationCoordinates = (
  formData: FormData,
  propertyData: PropertyFormData
): void => {
  if (propertyData.latitude) {
    formData.append("latitude", String(propertyData.latitude));
  }
  if (propertyData.longitude) {
    formData.append("longitude", String(propertyData.longitude));
  }
};

const appendPropertyCategories = (
  formData: FormData,
  propertyData: PropertyFormData
): void => {
  if (propertyData.propertyCategoryId) {
    formData.append("propertyCategoryId", propertyData.propertyCategoryId);
  }
  if (propertyData.customCategoryId) {
    formData.append("customCategoryId", propertyData.customCategoryId);
  }
};

const appendFacilities = (
  formData: FormData,
  propertyData: PropertyFormData
): void => {
  if (!propertyData.facilities || propertyData.facilities.length === 0) {
    return;
  }

  const facilities = propertyData.facilities.map(
    (facility: string | { facility: string }) => ({
      facility: typeof facility === "string" ? facility : facility.facility,
    })
  );

  formData.append("facilities", JSON.stringify(facilities));
};

const appendPropertyPictures = (
  formData: FormData,
  propertyData: PropertyFormData
): void => {
  if (!propertyData.pictures || propertyData.pictures.length === 0) return;

  const propertyPictures: Array<{
    note?: string | null;
    fileIndex?: number;
  }> = [];
  let propertyFileIndex = 0;

  propertyData.pictures.forEach((picture: PictureFormData) => {
    if (typeof picture === "object" && picture.file) {
      formData.append("propertyImages", picture.file);
      propertyPictures.push({
        note: picture.description || picture.note || null,
        fileIndex: propertyFileIndex++,
      });
    } else if (typeof picture === "string") {
      propertyPictures.push({ note: null });
    } else if (
      typeof picture === "object" &&
      (picture.url || picture.imageUrl)
    ) {
      propertyPictures.push({
        note: picture.description || picture.note || null,
      });
    }
  });

  if (propertyPictures.length > 0) {
    formData.append("propertyPictures", JSON.stringify(propertyPictures));
  }
};

const appendRooms = (
  formData: FormData,
  propertyData: PropertyFormData
): void => {
  if (!propertyData.rooms || propertyData.rooms.length === 0) return;

  const roomsData: Array<{
    name: string;
    description?: string;
    basePrice: number;
    capacity?: number;
    bedType?: string;
    bedCount?: number;
    hasImage?: boolean;
    fileIndex?: number;
    availabilities?: Array<{ date: string; isAvailable?: boolean }>;
    priceAdjustments?: Array<{
      title?: string;
      startDate: string;
      endDate: string;
      adjustType: string;
      adjustValue: number;
      applyAllDates?: boolean;
      dates?: string[];
    }>;
  }> = [];
  let roomFileIndex = 0;

  propertyData.rooms.forEach((room: RoomFormData) => {
    const roomData = {
      name: room.name,
      description: room.description,
      basePrice: room.basePrice,
      capacity: room.capacity || 1,
      bedType: room.bedType,
      bedCount: room.bedCount || 1,
      availabilities: room.availabilities || [],
      priceAdjustments: room.priceAdjustments || [],
      hasImage: false,
      fileIndex: undefined as number | undefined,
    };

    if (room.imageFile) {
      formData.append("roomImages", room.imageFile);
      roomData.hasImage = true;
      roomData.fileIndex = roomFileIndex++;
    } else if (room.imageUrl) {
      roomData.hasImage = false;
    }

    roomsData.push(roomData);
  });

  formData.append("rooms", JSON.stringify(roomsData));
};
