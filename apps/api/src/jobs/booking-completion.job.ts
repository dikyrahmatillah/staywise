import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import { BookingStatusUpdate } from "../types/booking.types.js";

export class BookingCompletionJob {
  // 🧪 TESTING: 2 minutes grace period (PROD: 24 hours)
  private readonly COMPLETION_GRACE_PERIOD_MINUTES = 2;

  async execute(): Promise<BookingStatusUpdate> {
    const now = new Date();
    const completionDeadline = new Date(
      now.getTime() - this.COMPLETION_GRACE_PERIOD_MINUTES * 60 * 1000
    );

    try {
      const bookingsToComplete = await prisma.booking.findMany({
        where: {
          status: "PROCESSING",
          checkOutDate: { lt: completionDeadline },
        },
        include: {
          Property: { select: { name: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (bookingsToComplete.length === 0) {
        console.log(`[${now.toISOString()}] 🧪 [TEST] No bookings to complete`);
        return { completedCount: 0, bookings: [] };
      }

      const updateResult = await prisma.booking.updateMany({
        where: {
          status: "PROCESSING",
          checkOutDate: { lt: completionDeadline },
        },
        data: { status: "COMPLETED" },
      });

      console.log(
        `[${now.toISOString()}] 🧪 [TEST] Completed ${
          updateResult.count
        } bookings (checkout > 2 min ago)`
      );

      bookingsToComplete.forEach((booking) => {
        console.log(
          `  - Booking ${booking.orderCode} completed (checkout: ${booking.checkOutDate})`
        );
      });

      return {
        completedCount: updateResult.count,
        bookings: bookingsToComplete.map((booking) => ({
          id: booking.id,
          orderCode: booking.orderCode,
          userEmail: booking.User?.email,
          propertyName: booking.Property?.name,
          roomName: booking.Room?.name,
          checkOutDate: booking.checkOutDate,
        })),
      };
    } catch (error) {
      console.error(`[${now.toISOString()}] Error completing bookings:`, error);
      throw new AppError("Failed to complete bookings", 500);
    }
  }
}
