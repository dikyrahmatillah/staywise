import { z } from "zod";

export const createBookingSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  propertyId: z.string().min(1, "Property ID is required"),
  checkIn: z.date("Check-in must be a valid date"),
  checkOut: z.date("Check-out must be a valid date"),
});

export const getBookingSchema = {
  params: z.object({
    id: z.uuid("Booking ID must be a valid UUID"),
  }),
};

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
