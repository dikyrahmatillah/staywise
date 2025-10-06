import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import { BookingStatusUpdate } from "../types/booking.types.js";

export class BookingConfirmationJob {
  // 🧪 TESTING: 2 minutes timeout (PROD: 24 hours)
  private readonly CONFIRMATION_TIMEOUT_MINUTES = 2;

  async execute(): Promise<BookingStatusUpdate> {
    const now = new Date();
    const confirmationDeadline = new Date(
      now.getTime() - this.CONFIRMATION_TIMEOUT_MINUTES * 60 * 1000
    );

    try {
      const pendingBookings = await prisma.booking.findMany({
        where: {
          status: "WAITING_CONFIRMATION",
          updatedAt: { lt: confirmationDeadline },
        },
        include: {
          Property: { select: { name: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (pendingBookings.length === 0) {
        console.log(
          `[${now.toISOString()}] 🧪 [TEST] No bookings to auto-confirm`
        );
        return { confirmedCount: 0, bookings: [] };
      }

      const updateResult = await prisma.booking.updateMany({
        where: {
          status: "WAITING_CONFIRMATION",
          updatedAt: { lt: confirmationDeadline },
        },
        data: { status: "PROCESSING" },
      });

      console.log(
        `[${now.toISOString()}] 🧪 [TEST] Auto-confirmed ${
          updateResult.count
        } bookings (updated > 2 min ago)`
      );

      pendingBookings.forEach((booking) => {
        console.log(
          `  - Booking ${booking.orderCode} auto-confirmed (updated: ${booking.updatedAt})`
        );
      });

      return {
        confirmedCount: updateResult.count,
        bookings: pendingBookings.map((booking) => ({
          id: booking.id,
          orderCode: booking.orderCode,
          userEmail: booking.User?.email,
          propertyName: booking.Property?.name,
          roomName: booking.Room?.name,
        })),
      };
    } catch (error) {
      console.error(
        `[${now.toISOString()}] Error auto-confirming bookings:`,
        error
      );
      throw new AppError("Failed to auto-confirm bookings", 500);
    }
  }
}
