import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { CreateBookingInput } from "@repo/schemas";

export async function createBooking(data: CreateBookingInput) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found. Please log in to make a booking.");
  }

  const orderCode = `ORD-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 5)
    .toUpperCase()}`;

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    select: { tenantId: true },
  });

  if (!property) {
    throw new AppError("Property not found", 400);
  }

  const checkInDate = new Date(data.checkIn);
  const checkOutDate = new Date(data.checkOut);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  ); //calculate night

  const availability = await checkRoomAvailability(
    data.propertyId,
    data.roomId,
    data.checkIn,
    data.checkOut
  );

  if (!availability.available) {
    throw new AppError("Room is no longer available for selected dates", 400);
  }

  return prisma.booking.create({
    data: {
      userId: data.userId,
      tenantId: property.tenantId,
      propertyId: data.propertyId,
      roomId: data.roomId,
      orderCode,
      checkInDate,
      checkOutDate,
      nights,
      pricePerNight: data.pricePerNight,
      totalAmount: data.totalAmount,
      expiresAt,
      status: "WAITING_PAYMENT",
      paymentMethod: "MANUAL_TRANSFER",
    },
    include: {
      Property: { select: { name: true } },
      Room: { select: { name: true } },
      User: { select: { firstName: true, lastName: true, email: true } },
    },
  });
}

export async function checkRoomAvailability(
  propertyId: string,
  roomId: string,
  checkInDate: string,
  checkOutDate: string
) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // Validate dates
  if (checkIn >= checkOut) {
    throw new AppError("Check-out must be after check-in", 400);
  }

  // Check if dates are in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (checkIn < today) {
    throw new AppError("Cannot book dates in the past", 400);
  }

  // Check room availability settings
  const unavailableDates = await prisma.roomAvailability.findMany({
    where: {
      roomId,
      date: {
        gte: checkIn,
        lt: checkOut,
      },
      isAvailable: false,
    },
  });

  if (unavailableDates.length > 0) {
    return {
      available: false,
      message: "Room is not available for some dates in the selected range",
      unavailableDates: unavailableDates.map((d) => d.date),
    };
  }

  // Check for conflicting bookings
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      propertyId,
      roomId,
      status: {
        in: [
          "WAITING_PAYMENT",
          "WAITING_CONFIRMATION",
          "PROCESSING",
          "COMPLETED",
        ],
      },
      OR: [
        {
          AND: [
            { checkInDate: { lte: checkIn } },
            { checkOutDate: { gt: checkIn } },
          ],
        },
        {
          AND: [
            { checkInDate: { lt: checkOut } },
            { checkOutDate: { gte: checkOut } },
          ],
        },
        {
          AND: [
            { checkInDate: { gte: checkIn } },
            { checkOutDate: { lte: checkOut } },
          ],
        },
      ],
    },
  });

  const isAvailable = conflictingBookings.length === 0;

  // Get room pricing
  let pricing = null;
  if (isAvailable) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { basePrice: true },
    });

    const priceAdjustments = await prisma.priceAdjustment.findMany({
      where: {
        roomId,
        startDate: { lte: checkOut },
        endDate: { gte: checkIn },
      },
    });

    pricing = {
      basePrice: room?.basePrice,
      hasAdjustments: priceAdjustments.length > 0,
    };
  }

  return {
    available: isAvailable,
    message: isAvailable
      ? "Room is available"
      : "Room is not available for selected dates",
    pricing,
    conflictingDates: conflictingBookings.map((booking) => ({
      checkIn: booking.checkInDate,
      checkOut: booking.checkOutDate,
      orderCode: booking.orderCode,
    })),
  };
}

export async function getAllBookings() {
  return prisma.booking.findMany({
    include: {
      Property: { select: { name: true, city: true } },
      Room: { select: { name: true } },
      User: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      Property: { select: { name: true, city: true } },
      Room: { select: { name: true } },
      User: { select: { firstName: true, lastName: true, email: true } },
    },
  });
}
