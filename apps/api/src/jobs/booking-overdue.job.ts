import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { BookingStatusUpdate } from "@/types/booking.types.js";

export class BookingOverdueJob {
  async execute(): Promise<BookingStatusUpdate> {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const overdueBookings = await prisma.booking.findMany({
        where: {
          status: { in: ["WAITING_CONFIRMATION", "PROCESSING"] },
          checkInDate: { lt: today },
        },
        include: {
          Property: { select: { name: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (overdueBookings.length === 0) {
        console.log(`[${now.toISOString()}] No overdue bookings to cancel`);
        return { canceledCount: 0, bookings: [] };
      }

      const updateResult = await prisma.booking.updateMany({
        where: {
          status: { in: ["WAITING_CONFIRMATION", "PROCESSING"] },
          checkInDate: { lt: today },
        },
        data: { status: "CANCELED" },
      });

      console.log(
        `[${now.toISOString()}] Canceled ${updateResult.count} overdue bookings`
      );

      overdueBookings.forEach((booking) => {
        console.log(`  - Booking ${booking.orderCode} canceled (overdue)`);
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
