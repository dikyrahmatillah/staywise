import { z } from "zod";

export const createBookingSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    propertyId: z.string().min(1, "Property ID is required"),
    roomId: z.string().min(1, "Room ID is required"),
    checkIn: z.string().datetime("Check-in must be a valid date"),
    checkOut: z.string().datetime("Check-out must be a valid date"),
    pricePerNight: z.number().positive("Price per night must be positive"),
    totalAmount: z.number().positive("Total amount must be positive"),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export const checkAvailabilitySchema = z.object({
  params: z.object({
    propertyId: z.string().uuid("Property ID must be valid UUID"),
    roomId: z.string().uuid("Room ID must be valid UUID"),
  }),
  query: z.object({
    checkInDate: z.string().datetime("Check-in date must be valid"),
    checkOutDate: z.string().datetime("Check-out date must be valid"),
  }),
});

export const getBookingSchema = {
  params: z.object({
    id: z.uuid("Booking ID must be a valid UUID"),
  }),
};

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
