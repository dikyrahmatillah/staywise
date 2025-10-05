import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { BookingStatusUpdate } from "@/types/booking.types.js";

export class BookingExpirationJob {
  // 🧪 TESTING: 2 minutes timeout (PROD: use expiresAt field)
  private readonly EXPIRATION_TIMEOUT_MINUTES = 2;

  async execute(): Promise<BookingStatusUpdate> {
    const now = new Date();
    const expirationDeadline = new Date(
      now.getTime() - this.EXPIRATION_TIMEOUT_MINUTES * 60 * 1000
    );

    try {
      // 🧪 TEST MODE: Find bookings created more than 2 minutes ago
      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: "WAITING_PAYMENT",
          createdAt: { lt: expirationDeadline }, // Using createdAt for testing
        },
        include: {
          Property: { select: { name: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (expiredBookings.length === 0) {
        console.log(
          `[${now.toISOString()}] 🧪 [TEST] No expired bookings found`
        );
        return { expiredCount: 0, bookings: [] };
      }

      const updateResult = await prisma.booking.updateMany({
        where: {
          status: "WAITING_PAYMENT",
          createdAt: { lt: expirationDeadline },
        },
        data: { status: "CANCELED" },
      });

      console.log(
        `[${now.toISOString()}] 🧪 [TEST] Expired ${
          updateResult.count
        } bookings (created > 2 min ago)`
      );

      expiredBookings.forEach((booking) => {
        console.log(
          `  - Booking ${booking.orderCode} (User: ${booking.User?.firstName} ${booking.User?.lastName}) expired (created: ${booking.createdAt})`
        );
      });

      return {
        expiredCount: updateResult.count,
        bookings: expiredBookings.map((booking) => ({
          id: booking.id,
          orderCode: booking.orderCode,
          userEmail: booking.User?.email,
          propertyName: booking.Property?.name,
          roomName: booking.Room?.name,
          expiresAt: booking.expiresAt,
        })),
      };
    } catch (error) {
      console.error(`[${now.toISOString()}] Error expiring bookings:`, error);
      throw new AppError("Failed to expire bookings", 500);
    }
  }
}
