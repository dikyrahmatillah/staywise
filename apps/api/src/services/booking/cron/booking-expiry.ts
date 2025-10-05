import { prisma } from "@/configs/prisma.config.js";

export class BookingExpiryService {
  static async cancelExpiredBookings() {
    try {
      const now = new Date();

      // Find expired bookings
      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: "WAITING_PAYMENT",
          expiresAt: {
            lte: now,
          },
        },
        select: {
          id: true,
          orderCode: true,
        },
      });

      if (expiredBookings.length === 0) {
        console.log("No expired bookings found");
        return { cancelledCount: 0 };
      }

      // Cancel them
      const result = await prisma.booking.updateMany({
        where: {
          id: {
            in: expiredBookings.map((b) => b.id),
          },
        },
        data: {
          status: "CANCELED",
          expiresAt: null,
        },
      });

      console.log(`Cancelled ${result.count} expired bookings`);
      return { cancelledCount: result.count };
    } catch (error) {
      console.error("Error cancelling expired bookings:", error);
      throw error;
    }
  }

  /**
   * Start a simple interval to check for expired bookings every 10 minutes
   */
  static startExpiryCheck() {
    // Check every 10 minutes (600,000 ms)
    setInterval(async () => {
      try {
        await BookingExpiryService.cancelExpiredBookings();
      } catch (error) {
        console.error("Expiry check failed:", error);
      }
    }, 1 * 60 * 1000);

    console.log("Simple expiry check started (every 1 minutes)");
  }
}

BookingExpiryService.startExpiryCheck();
