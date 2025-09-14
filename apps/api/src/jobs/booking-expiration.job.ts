import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { BookingStatusUpdate } from "@/types/booking.types.js";

export class BookingExpirationJob {
  async execute(): Promise<BookingStatusUpdate> {
    const now = new Date();
    
    try {
      const expiredBookings = await prisma.booking.findMany({
        where: {
          status: "WAITING_PAYMENT",
          expiresAt: { lt: now }
        },
        include: {
          Property: { select: { name: true } },
          Room: { select: { name: true } },
          User: { select: { firstName: true, lastName: true, email: true } },
        },
      });

      if (expiredBookings.length === 0) {
        console.log(`[${now.toISOString()}] No expired bookings found`);
        return { expiredCount: 0, bookings: [] };
      }

      const updateResult = await prisma.booking.updateMany({
        where: {
          status: "WAITING_PAYMENT",
          expiresAt: { lt: now }
        },
        data: { status: "CANCELED" }
      });

      console.log(`[${now.toISOString()}] Expired ${updateResult.count} bookings`);
      
      expiredBookings.forEach(booking => {
        console.log(`  - Booking ${booking.orderCode} (User: ${booking.User?.firstName} ${booking.User?.lastName}) expired`);
      });

      return {
        expiredCount: updateResult.count,
        bookings: expiredBookings.map(booking => ({
          id: booking.id,
          orderCode: booking.orderCode,
          userEmail: booking.User?.email,
          propertyName: booking.Property?.name,
          roomName: booking.Room?.name,
          expiresAt: booking.expiresAt
        }))
      };
    } catch (error) {
      console.error(`[${now.toISOString()}] Error expiring bookings:`, error);
      throw new AppError("Failed to expire bookings", 500);
    }
  }
}