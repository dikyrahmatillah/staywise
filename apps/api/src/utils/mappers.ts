import type { CreatePropertyInput } from "@repo/schemas";

export type PictureInput = NonNullable<CreatePropertyInput["pictures"]>[number];
export type FacilityInput = NonNullable<
  CreatePropertyInput["facilities"]
>[number];
export type RoomInput = CreatePropertyInput["rooms"][number];
export type AvailabilityInput = NonNullable<
  RoomInput["availabilities"]
>[number];
export type PriceAdjInput = NonNullable<RoomInput["priceAdjustments"]>[number];

export function mapPictures(pictures?: PictureInput[]) {
  if (!pictures?.length) return undefined;
  return {
    create: pictures.map((p) => ({
      imageUrl: p.imageUrl,
      note: p.note ?? null,
    })),
  } as const;
}

export function mapFacilities(facilities?: FacilityInput[]) {
  if (!facilities?.length) return undefined;
  return {
    create: facilities.map((f) => ({
      facility: f.facility,
    })),
  } as const;
}

export function mapAvailabilities(availabilities?: AvailabilityInput[]) {
  if (!availabilities?.length) return undefined;
  return {
    create: availabilities.map((a) => ({
      date: new Date(a.date),
      isAvailable: a.isAvailable ?? true,
    })),
  } as const;
}

export function mapPriceAdjustments(adjustments?: PriceAdjInput[]) {
  if (!adjustments?.length) return undefined;
  return {
    create: adjustments.map((pa) => ({
      title: pa.title ?? null,
      startDate: new Date(pa.startDate),
      endDate: new Date(pa.endDate),
      adjustType: pa.adjustType,
      adjustValue: pa.adjustValue.toString(),
      applyAllDates: pa.applyAllDates ?? true,
      Dates: pa.dates?.length
        ? { create: pa.dates.map((d) => ({ date: new Date(d) })) }
        : undefined,
    })),
  } as const;
}

export function mapRooms(rooms: RoomInput[]) {
  if (!rooms?.length) return undefined;
  return {
    create: rooms.map((r) => ({
      name: r.name,
      basePrice: r.basePrice.toString(),
      capacity: r.capacity ?? 1,
      bedType: r.bedType ?? undefined,
      bedCount: r.bedCount ?? 1,
      imageUrl: r.imageUrl ?? null,
      RoomAvailabilities: mapAvailabilities(r.availabilities),
      PriceAdjustments: mapPriceAdjustments(r.priceAdjustments),
    })),
  } as const;
}
