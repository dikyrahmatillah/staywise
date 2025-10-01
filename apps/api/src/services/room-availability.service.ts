import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import {
  BlockRoomDatesInput,
  UnblockRoomDatesInput,
  GetRoomAvailabilityInput,
} from "@repo/schemas";

export class RoomAvailabilityService {
  async getRoomAvailability(roomId: string, params: GetRoomAvailabilityInput) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const whereClause: any = {
      roomId,
      isAvailable: false,
    };

    if (params.startDate || params.endDate) {
      whereClause.date = {};
      if (params.startDate) {
        whereClause.date.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        whereClause.date.lte = new Date(params.endDate);
      }
    }

    const unavailableDates = await prisma.roomAvailability.findMany({
      where: whereClause,
      orderBy: { date: "asc" },
      select: {
        id: true,
        roomId: true,
        date: true,
        isAvailable: true,
        createdAt: true,
      },
    });

    const formattedDates = unavailableDates.map((item) => ({
      ...item,
      date: item.date.toISOString().split("T")[0],
      createdAt: item.createdAt.toISOString(),
    }));

    return formattedDates;
  }

  async blockRoomDates(roomId: string, data: BlockRoomDatesInput) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const results = await Promise.all(
      data.dates.map(async (dateString: string) => {
        return prisma.roomAvailability.upsert({
          where: {
            roomId_date: {
              roomId,
              date: new Date(dateString),
            },
          },
          update: {
            isAvailable: false,
          },
          create: {
            roomId,
            date: new Date(dateString),
            isAvailable: false,
          },
          select: {
            id: true,
            roomId: true,
            date: true,
            isAvailable: true,
            createdAt: true,
          },
        });
      })
    );

    const formattedResults = results.map((item) => ({
      ...item,
      date: item.date.toISOString().split("T")[0],
      createdAt: item.createdAt.toISOString(),
    }));

    return formattedResults;
  }

  async unblockRoomDates(roomId: string, data: UnblockRoomDatesInput) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const results = await Promise.all(
      data.dates.map(async (dateString: string) => {
        return prisma.roomAvailability.deleteMany({
          where: {
            roomId,
            date: new Date(dateString),
          },
        });
      })
    );

    return results;
  }

  async getUnavailableDates(roomId: string) {
    // Get all confirmed/active bookings for this room
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: [
            "WAITING_PAYMENT",
            "WAITING_CONFIRMATION",
            "PROCESSING",
            "COMPLETED",
          ],
        },
      },
      select: {
        checkInDate: true,
        checkOutDate: true,
      },
    });

    // Get manually blocked dates from RoomAvailability
    const blockedDates = await prisma.roomAvailability.findMany({
      where: {
        roomId,
        isAvailable: false,
      },
      select: {
        date: true,
      },
    });

    // Convert bookings to array of date strings
    const unavailableDates: string[] = [];

    // Add all dates from bookings
    bookings.forEach((booking) => {
      const current = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);

      while (current < end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");
        unavailableDates.push(`${year}-${month}-${day}`);
        current.setDate(current.getDate() + 1);
      }
    });

    // Add manually blocked dates
    blockedDates.forEach((blocked) => {
      const date = new Date(blocked.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      if (!unavailableDates.includes(dateStr)) {
        unavailableDates.push(dateStr);
      }
    });

    return {
      roomId,
      unavailableDates: [...new Set(unavailableDates)].sort(),
    };
  }
}

export const roomAvailabilityService = new RoomAvailabilityService();
