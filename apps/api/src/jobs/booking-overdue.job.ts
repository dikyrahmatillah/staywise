import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { BookingStatusUpdate } from "@/types/booking.types.js";

export class BookingOverdueJob {
  // 🧪 TESTING: 2 minutes grace period (PROD: uses today's date)
  private readonly OVERDUE_GRACE_PERIOD_MINUTES = 2;

  async execute(): Promise<BookingStatusUpdate> {
    const now = new Date();
    const overdueDeadline = new Date(
      now.getTime() - this.OVERDUE_GRACE_PERIOD_MINUTES * 60 * 1000
    );

    try {
      const overdueBookings = await prisma.booking.findMany({
        where: {
          status: { in: ["WAITING_CONFIRMATION", "PROCESSING"] },
          checkInDate: { lt: overdueDeadline },
        },
        include: {
          Property: { select: { name: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (overdueBookings.length === 0) {
        console.log(
          `[${now.toISOString()}] 🧪 [TEST] No overdue bookings to cancel`
        );
        return { canceledCount: 0, bookings: [] };
      }

      const updateResult = await prisma.booking.updateMany({
        where: {
          status: { in: ["WAITING_CONFIRMATION", "PROCESSING"] },
          checkInDate: { lt: overdueDeadline },
        },
        data: { status: "CANCELED" },
      });

      console.log(
        `[${now.toISOString()}] 🧪 [TEST] Canceled ${
          updateResult.count
        } overdue bookings (checkin > 2 min ago)`
      );

      overdueBookings.forEach((booking) => {
        console.log(
          `  - Booking ${booking.orderCode} canceled (overdue, checkin: ${booking.checkInDate})`
        );
      });

      return {
        canceledCount: updateResult.count,
        bookings: overdueBookings.map((booking) => ({
          id: booking.id,
          orderCode: booking.orderCode,
          userEmail: booking.User?.email,
          propertyName: booking.Property?.name,
          roomName: booking.Room?.name,
          checkInDate: booking.checkInDate,
        })),
      };
    } catch (error) {
      console.error(
        `[${now.toISOString()}] Error canceling overdue bookings:`,
        error
      );
      throw new AppError("Failed to cancel overdue bookings", 500);
    }
  }
}