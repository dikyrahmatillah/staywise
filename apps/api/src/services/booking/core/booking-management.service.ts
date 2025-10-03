import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import type { BookingFilters } from "@repo/types";
import type { OrderStatus } from "@/generated/prisma/index.js";

export class BookingManagementService {
  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        Property: { select: { name: true, city: true } },
        Room: { select: { name: true } },
        User: { select: { firstName: true, lastName: true, email: true } },
      },
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
        // Multiple statuses (e.g., "WAITING_PAYMENT,WAITING_CONFIRMATION,PROCESSING")
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
        include: {
          User: { select: { firstName: true, lastName: true, email: true } },
          Property: { select: { name: true, city: true } },
          Room: { select: { name: true } },
          paymentProof: true,
          gatewayPayment: true,
        },
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
      include: {
        Property: { select: { name: true, city: true } },
        Room: { select: { name: true } },
        User: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        Property: { select: { name: true, city: true } },
        Room: { select: { name: true } },
        User: { select: { firstName: true, lastName: true, email: true } },
        paymentProof: true,
        gatewayPayment: true,
      },
    });
  }

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
      include: {
        Property: { select: { name: true, city: true } },
        Room: { select: { name: true } },
        User: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  private generateDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];

    // 🔧 FIX: Work with UTC dates to avoid timezone issues
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

    console.log(`🔍 [DEBUG] Generating date range (UTC):`);
    console.log(
      `  Start: ${
        currentDate.toISOString().split("T")[0]
      } (day ${currentDate.getUTCDate()})`
    );
    console.log(
      `  End: ${
        endDateUTC.toISOString().split("T")[0]
      } (day ${endDateUTC.getUTCDate()})`
    );

    while (currentDate < endDateUTC) {
      // Create date in UTC to avoid timezone shifts
      const dateToAdd = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate()
        )
      );
      dates.push(dateToAdd);
      console.log(
        `  📅 [DEBUG] Adding date: ${
          dateToAdd.toISOString().split("T")[0]
        } (day ${dateToAdd.getUTCDate()})`
      );

      // Move to next day using UTC
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    console.log(`✅ [DEBUG] Generated ${dates.length} dates for blocking`);
    return dates;
  }

  private async blockDatesForBooking(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    bookingId: string
  ) {
    try {
      console.log(`🔒 Starting date blocking for booking ${bookingId}:`);
      console.log(`  Room: ${roomId}`);
      console.log(
        `  Check-in: ${
          checkInDate.toISOString().split("T")[0]
        } (day ${checkInDate.getDate()})`
      );
      console.log(
        `  Check-out: ${
          checkOutDate.toISOString().split("T")[0]
        } (day ${checkOutDate.getDate()})`
      );

      const dates = this.generateDateRange(checkInDate, checkOutDate);

      if (dates.length === 0) {
        console.warn(
          `⚠️ No dates generated for blocking! Check date range logic.`
        );
        return;
      }

      const blockedDates = await Promise.all(
        dates.map(async (date, index) => {
          console.log(
            `  🔒 Blocking date ${index + 1}/${dates.length}: ${
              date.toISOString().split("T")[0]
            } (day ${date.getDate()})`
          );

          return prisma.roomAvailability.upsert({
            where: {
              roomId_date: {
                roomId,
                date,
              },
            },
            update: {
              isAvailable: false,
              bookingId, // Track which booking blocked this date
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

      // Log the actual blocked dates for verification
      const blockedDateStrings = blockedDates.map(
        (d) => d.date.toISOString().split("T")[0]
      );
      console.log(`📅 Blocked dates: ${blockedDateStrings.join(", ")}`);
    } catch (error) {
      console.error("❌ Error blocking dates for booking:", error);
      throw error;
    }
  }

  async approvePaymentProof(bookingId: string, tenantId: string) {
    console.log(
      `🚨 [DEBUG] approvePaymentProof called with bookingId: ${bookingId}, tenantId: ${tenantId}`
    );

    // First, verify the booking exists and belongs to the tenant
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId: tenantId, // Ensure tenant owns the property
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

    console.log(`💰 Approving payment for booking ${booking.orderCode}:`);
    console.log(`  Booking ID: ${bookingId}`);
    console.log(`  Room ID: ${booking.roomId}`);
    console.log(
      `  Check-in: ${
        booking.checkInDate.toISOString().split("T")[0]
      } (day ${booking.checkInDate.getDate()})`
    );
    console.log(
      `  Check-out: ${
        booking.checkOutDate.toISOString().split("T")[0]
      } (day ${booking.checkOutDate.getDate()})`
    );

    // Update payment proof and booking status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment proof
      await tx.paymentProof.update({
        where: { id: booking.paymentProof!.id },
        data: {
          acceptedAt: new Date(),
          rejectedAt: null, // Clear any previous rejection
        },
      });

      // Update booking status to PROCESSING
      return await tx.booking.update({
        where: { id: bookingId },
        data: { status: "PROCESSING" },
        include: {
          Property: { select: { name: true, city: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
          paymentProof: true,
        },
      });
    });
    try {
      await this.blockDatesForBooking(
        booking.roomId,
        booking.checkInDate,
        booking.checkOutDate,
        bookingId
      );
      console.log(
        `🔒 [DEBUG] blockDatesForBooking called for booking ${bookingId}`
      );
    } catch (error) {
      console.error(
        "❌ Error blocking room dates after payment approval:",
        error
      );
      // Log error but don't fail the approval process
    }
    return result;
  }

  async rejectPaymentProof(bookingId: string, tenantId: string) {
    // First, verify the booking exists and belongs to the tenant
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId: tenantId, // Ensure tenant owns the property
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

    // Update payment proof and booking status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payment proof with rejection timestamp
      await tx.paymentProof.update({
        where: { id: booking.paymentProof!.id },
        data: {
          rejectedAt: new Date(),
          acceptedAt: null, // Clear any previous acceptance
        },
      });

      // Change booking status back to WAITING_PAYMENT for re-upload
      return await tx.booking.update({
        where: { id: bookingId },
        data: { status: "WAITING_PAYMENT" },
        include: {
          Property: { select: { name: true, city: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
          paymentProof: true,
        },
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
      include: {
        Property: { select: { name: true, city: true } },
        Room: { select: { name: true } },
        User: { select: { firstName: true, lastName: true, email: true } },
      },
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
