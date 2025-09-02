import { prisma } from "@repo/database";
import { CreateBookingInput } from "@repo/schemas";

export async function createBooking(data: CreateBookingInput) {
  return prisma.booking.create({
    data: {
      userId: data.userId,
      propertyId: data.propertyId,
      checkInDate: new Date(data.checkIn),
      checkOutDate: new Date(data.checkOut),
    },
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
  });
}
