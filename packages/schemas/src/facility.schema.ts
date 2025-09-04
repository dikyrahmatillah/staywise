import z from "zod";

export const amenitiesEnum = z.enum([
  "WIFI",
  "AIR_CONDITIONER",
  "PARKING",
  "SWIMMING_POOL",
  "KITCHEN",
  "TV",
  "WATER_HEATER",
  "WASHING_MACHINE",
  "REFRIGERATOR",
  "MICROWAVE",
  "ELEVATOR",
  "GYM",
  "RECEPTION_24H",
  "SECURITY",
  "CCTV",
  "PET_FRIENDLY",
  "SMOKING_ALLOWED",
  "NON_SMOKING",
  "WHEELCHAIR_ACCESS",
  "BREAKFAST",
  "BALCONY",
  "SEA_VIEW",
  "MOUNTAIN_VIEW",
  "GARDEN",
  "BBQ",
]);

export const createFacilitySchema = z.object({
  facility: amenitiesEnum,
  note: z.string().optional().nullable(),
});

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
