import { z } from "zod";

const optionalDate = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const d = new Date(String(val));
  return isNaN(d.getTime()) ? undefined : d;
}, z.date().optional());

const optionalNumber = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  const n = Number(String(val));
  return Number.isNaN(n) ? undefined : n;
}, z.number().int().nonnegative().optional());

export const searchSchema = z.object({
  location: z.string().optional(),
  checkIn: optionalDate,
  checkOut: optionalDate,
  adults: optionalNumber,
  childrenCount: optionalNumber,
  pets: optionalNumber,
});

export type SearchSchema = z.infer<typeof searchSchema>;
