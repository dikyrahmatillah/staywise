import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import {
  validateBookingDataSafe,
  bookingValidationUtils,
  type BookingFormData,
} from "@repo/schemas";
import { midtransService } from "@/services/midtrans.service.js";
import { BookingUtilsService } from "./booking-utils.service.js";
import type {
  CreateBookingInput,
  RoomAvailabilityResult,
  AvailabilityCheckParams,
} from "@repo/types";
import type { BookingCreationData } from "@/services/booking/types/booking-internal.type.js";

export class BookingCoreService {
  private utilsService: BookingUtilsService;

  constructor() {
    this.utilsService = new BookingUtilsService();
  }
  async createBooking(data: BookingCreationData) {
    const validation = this.validateBookingInput(data);

    if (!validation.success) {
      const errorMessages = this.utilsService.formatValidationErrors(
        validation.errors || {}
      );
      throw new AppError(
        `Booking validation failed: ${errorMessages.join(", ")}`,
        400
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new AppError(
        "User not found. Please log in to make a booking.",
        400
      );
    }

    const orderCode = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
      select: { tenantId: true, maxGuests: true },
    });

    if (!property) {
      throw new AppError("Property not found", 400);
    }

    // Validate guest count against property limits
    const totalGuests = (data.adults || 1) + (data.children || 0);
    if (property.maxGuests && totalGuests > property.maxGuests) {
      throw new AppError(
        `Total guests (${totalGuests}) exceeds property maximum (${property.maxGuests})`,
        400
      );
    }

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    // Use our validation utilities for calculating nights
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Comprehensive availability check
    const availability = await this.checkRoomAvailability(
      data.propertyId,
      data.roomId,
      data.checkIn.toString(),
      data.checkOut.toString()
    );

    if (!availability.available) {
      throw new AppError("Room is no longer available for selected dates", 400);
    }

    // Validate booking period using our utilities
    if (
      !bookingValidationUtils.isValidBookingPeriod(checkInDate, checkOutDate)
    ) {
      throw new AppError(
        "Invalid booking period. Check-in must be today or in the future, and check-out must be after check-in",
        400
      );
    }

    // Calculate total amount using our validation utilities
    const calculatedTotalAmount = bookingValidationUtils.calculateTotalPrice(
      checkInDate,
      checkOutDate,
      data.pricePerNight
    );

    // Verify the provided total amount matches our calculation
    if (Math.abs(data.totalAmount - calculatedTotalAmount) > 0.01) {
      throw new AppError(
        `Total amount mismatch. Expected: ${calculatedTotalAmount}, Provided: ${data.totalAmount}`,
        400
      );
    }

    const result = await prisma.$transaction(async (prismaTransaction) => {
      const booking = await prismaTransaction.booking.create({
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
          paymentMethod: data.paymentMethod || "MANUAL_TRANSFER",
        },
        include: {
          Property: { select: { name: true, maxGuests: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (data.paymentMethod === "PAYMENT_GATEWAY") {
        await this.initializeMidtransPayment(booking);
      }

      return booking;
    });

    return result;
  }

  async checkRoomAvailability(
    propertyId: string,
    roomId: string,
    checkInDate: string,
    checkOutDate: string
  ): Promise<RoomAvailabilityResult> {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Use our validation utilities for date validation
    if (!bookingValidationUtils.isValidBookingPeriod(checkIn, checkOut)) {
      throw new AppError(
        "Invalid date range. Check-out must be after check-in and dates cannot be in the past",
        400
      );
    }

    // Calculate nights using standard calculation
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights > 365) {
      throw new AppError("Maximum stay is 365 nights", 400);
    }

    if (nights < 1) {
      throw new AppError("Minimum stay is 1 night", 400);
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
    let pricing: { basePrice?: number; hasAdjustments: boolean } | null = null;
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
        basePrice: room?.basePrice ? Number(room.basePrice) : undefined,
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

  async checkAvailabilityWithValidation(params: AvailabilityCheckParams) {
    const {
      propertyId,
      roomId,
      checkInDate,
      checkOutDate,
      adults = 1,
      children = 0,
      pets = 0,
      pricePerNight,
    } = params;

    // First validate the booking parameters
    const bookingData: Partial<BookingFormData> = {
      checkInDate,
      checkOutDate,
      adults,
      children,
      pets,
      propertyId,
      pricePerNight,
    };

    const validation = validateBookingDataSafe(bookingData, 10);

    if (!validation.success) {
      return {
        available: false,
        validationErrors: validation.errors,
        message: "Booking parameters are invalid",
      };
    }

    // Get property max guests info
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { maxGuests: true },
    });

    if (property && property.maxGuests) {
      const totalGuests = adults + children;
      if (totalGuests > property.maxGuests) {
        return {
          available: false,
          message: `Total guests (${totalGuests}) exceeds property maximum (${property.maxGuests})`,
        };
      }
    }

    // Check room availability
    const availability = await this.checkRoomAvailability(
      propertyId,
      roomId,
      checkInDate.toISOString(),
      checkOutDate.toISOString()
    );

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      ...availability,
      nights,
      totalPrice: bookingValidationUtils.calculateTotalPrice(
        checkInDate,
        checkOutDate,
        pricePerNight
      ),
      validationPassed: true,
    };
  }

  private async initializeMidtransPayment(booking: any) {
    try {
      const snapToken = await midtransService.createSnapToken(booking);
      console.log(
        "Initializing Midtrans payment for booking:",
        booking.orderCode
      );
      return snapToken;
    } catch (error) {
      console.error("Failed to initialize Midtrans payment:", error);

      // Revert to manual transfer
      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentMethod: "MANUAL_TRANSFER" },
      });

      throw new AppError(
        "Payment gateway unavailable. Booking converted to manual transfer.",
        400
      );
    }
  }

  private validateBookingInput(data: BookingCreationData) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    const bookingData: Partial<BookingFormData> = {
      checkInDate,
      checkOutDate,
      adults: data.adults || 1,
      children: data.children || 0,
      pets: data.pets || 0,
      propertyId: data.propertyId,
      pricePerNight: data.pricePerNight,
    };

    return validateBookingDataSafe(bookingData, 10); // Default max guests
  }
}