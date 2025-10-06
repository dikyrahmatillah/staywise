// apps/api/src/services/booking/core/booking-management.service.ts
// Key changes: Ensure createdAt is included in all booking queries

import { prisma } from "../../../configs/prisma.config.js";
import { AppError } from "../../../errors/app.error.js";
import type { BookingFilters } from "../../../types/booking.js";
import type { OrderStatus } from "../../../generated/prisma/index.js";

export class BookingManagementService {
  // Common select object to ensure consistency
  private readonly bookingSelect = {
    id: true,
    userId: true,
    tenantId: true,
    propertyId: true,
    roomId: true,
    orderCode: true,
    status: true,
    paymentMethod: true,
    snapToken: true,
    orderId: true,
    paidAt: true,
    checkInDate: true,
    checkOutDate: true,
    nights: true,
    qty: true,
    pricePerNight: true,
    totalAmount: true,
    expiresAt: true,
    createdAt: true, // ✅ Ensure createdAt is always included
    updatedAt: true,
    Property: {
      select: {
        name: true,
        city: true,
        id: true, // ✅ Include property ID for linking
      },
    },
    Room: {
      select: {
        name: true,
      },
    },
    User: {
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    paymentProof: true,
    gatewayPayment: true,
  };

  async getAllBookings() {
    return prisma.booking.findMany({
      select: this.bookingSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getBookingsWithPagination(filters: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    userId?: string;
    tenantId?: string;
    propertyId?: string;
  }) {
    const skip = (filters.page - 1) * filters.limit;

    // Build where clause
    const where: any = {};

    // Role-based filtering
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.tenantId) {
      where.tenantId = filters.tenantId;
    }
    if (filters.propertyId) {
      where.propertyId = filters.propertyId;
    }

    // Status filtering
    if (filters.status && filters.status !== "all") {
      if (filters.status.includes(",")) {
        where.status = { in: filters.status.split(",") };
      } else {
        where.status = filters.status;
      }
    }

    // Search filtering
    if (filters.search) {
      where.OR = [
        { orderCode: { contains: filters.search, mode: "insensitive" } },
        {
          User: {
            OR: [
              { firstName: { contains: filters.search, mode: "insensitive" } },
              { lastName: { contains: filters.search, mode: "insensitive" } },
              { email: { contains: filters.search, mode: "insensitive" } },
            ],
          },
        },
        {
          Property: { name: { contains: filters.search, mode: "insensitive" } },
        },
      ];
    }

    // Get total count and paginated data in parallel
    const [total, bookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        select: this.bookingSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take: filters.limit,
      }),
    ]);

    return { data: bookings, total };
  }

  async getBookings(filters: BookingFilters = {}) {
    const whereClause: any = {};

    if (filters.userId) whereClause.userId = filters.userId;
    if (filters.tenantId) whereClause.tenantId = filters.tenantId;
    if (filters.propertyId) whereClause.propertyId = filters.propertyId;
    if (filters.status) whereClause.status = { in: filters.status };

    // By default, exclude expired bookings unless specifically requested
    if (!filters.includeExpired) {
      whereClause.status = whereClause.status
        ? { in: filters.status?.filter((s) => s !== "EXPIRED") }
        : { not: "EXPIRED" };
    }

    return prisma.booking.findMany({
      where: whereClause,
      select: this.bookingSelect,
      orderBy: { createdAt: "desc" },
    });
  }

  async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      select: this.bookingSelect,
    });
  }

  // ... rest of the methods remain the same but use this.bookingSelect
  // for consistency wherever booking data is returned

  async cancelBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.status !== "WAITING_PAYMENT") {
      throw new AppError(
        "Only bookings waiting for payment can be canceled",
        400
      );
    }

    if (booking.paymentProof) {
      throw new AppError(
        "Cannot cancel booking after payment proof has been uploaded. Please contact support if needed.",
        400
      );
    }

    return prisma.booking.update({
      where: { id },
      data: { status: "CANCELED" },
      select: this.bookingSelect,
    });
  }

  private generateDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
      )
    );
    const endDateUTC = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      )
    );

    while (currentDate < endDateUTC) {
      const dateToAdd = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate()
        )
      );
      dates.push(dateToAdd);
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates;
  }

  private async blockDatesForBooking(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    bookingId: string
  ) {
    try {
      const dates = this.generateDateRange(checkInDate, checkOutDate);

      if (dates.length === 0) {
        console.warn(
          `⚠️ No dates generated for blocking! Check date range logic.`
        );
        return;
      }

      const blockedDates = await Promise.all(
        dates.map(async (date) => {
          return prisma.roomAvailability.upsert({
            where: {
              roomId_date: {
                roomId,
                date,
              },
            },
            update: {
              isAvailable: false,
              bookingId,
            },
            create: {
              roomId,
              date,
              isAvailable: false,
              bookingId,
            },
          });
        })
      );

      console.log(
        `✅ Successfully blocked ${blockedDates.length} dates for room ${roomId}, booking ${bookingId}`
      );
    } catch (error) {
      console.error("❌ Error blocking dates for booking:", error);
      throw error;
    }
  }

  async approvePaymentProof(bookingId: string, tenantId: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId: tenantId,
      },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found or access denied", 404);
    }

    if (!booking.paymentProof) {
      throw new AppError("No payment proof found for this booking", 400);
    }

    if (booking.status !== "WAITING_CONFIRMATION") {
      throw new AppError(
        "Payment proof can only be approved for bookings with WAITING_CONFIRMATION status",
        400
      );
    }

    if (booking.paymentProof.acceptedAt) {
      throw new AppError("Payment proof has already been approved", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.paymentProof.update({
        where: { id: booking.paymentProof!.id },
        data: {
          acceptedAt: new Date(),
          rejectedAt: null,
        },
      });

      return await tx.booking.update({
        where: { id: bookingId },
        data: { status: "PROCESSING" },
        select: this.bookingSelect,
      });
    });

    try {
      await this.blockDatesForBooking(
        booking.roomId,
        booking.checkInDate,
        booking.checkOutDate,
        bookingId
      );
    } catch (error) {
      console.error(
        "❌ Error blocking room dates after payment approval:",
        error
      );
    }

    return result;
  }

  async rejectPaymentProof(bookingId: string, tenantId: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId: tenantId,
      },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found or access denied", 404);
    }

    if (!booking.paymentProof) {
      throw new AppError("No payment proof found for this booking", 400);
    }

    if (booking.status !== "WAITING_CONFIRMATION") {
      throw new AppError(
        "Payment proof can only be rejected for bookings with WAITING_CONFIRMATION status",
        400
      );
    }

    if (booking.paymentProof.rejectedAt) {
      throw new AppError("Payment proof has already been rejected", 400);
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.paymentProof.update({
        where: { id: booking.paymentProof!.id },
        data: {
          rejectedAt: new Date(),
          acceptedAt: null,
        },
      });

      return await tx.booking.update({
        where: { id: bookingId },
        data: { status: "WAITING_PAYMENT" },
        select: this.bookingSelect,
      });
    });

    return result;
  }

  async verifyTenantPropertyAccess(
    tenantId: string,
    propertyId: string
  ): Promise<boolean> {
    const property = await prisma.property.findFirst({
      where: { id: propertyId, tenantId },
    });
    return !!property;
  }

  async updateBookingStatus(id: string, status: OrderStatus) {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    return prisma.booking.update({
      where: { id },
      data: { status },
      select: this.bookingSelect,
    });
  }

  async getBookingsByUser(userId: string) {
    return this.getBookings({ userId });
  }

  async getBookingsByTenant(tenantId: string) {
    return this.getBookings({ tenantId });
  }

  async getBookingsByProperty(propertyId: string) {
    return this.getBookings({ propertyId });
  }

  async getActiveBookings() {
    return this.getBookings({
      status: [
        "WAITING_PAYMENT",
        "WAITING_CONFIRMATION",
        "PROCESSING",
        "COMPLETED",
      ],
    });
  }

  async getPendingBookings() {
    return this.getBookings({
      status: ["WAITING_PAYMENT", "WAITING_CONFIRMATION"],
    });
  }
}
