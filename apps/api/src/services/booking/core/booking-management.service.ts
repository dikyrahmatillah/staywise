import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import type { BookingFilters } from "@repo/types";
import type { OrderStatus } from "@repo/database/generated/prisma/index.js";

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

  async approvePaymentProof(bookingId: string, tenantId: string) {
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

      // Update booking status to COMPLETED
      return await tx.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" },
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

  // NEW: Reject payment proof (allows re-upload)
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
