import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import {
  CreateRoomInput,
  UpdateRoomInput,
  BlockRoomDatesInput,
  UnblockRoomDatesInput,
  GetRoomAvailabilityInput,
  CreatePriceAdjustmentInput,
} from "@repo/schemas";

export class RoomService {
  private async ensurePropertyMaxGuests(propertyId: string) {
    const agg = await prisma.room.aggregate({
      where: { propertyId },
      _max: { capacity: true },
    });

    const maxCapacity = agg._max.capacity ?? 1;

    try {
      await (prisma as any).property.update({
        where: { id: propertyId },
        data: { maxGuests: maxCapacity },
      });
    } catch (err) {}
  }
  async createRoom(propertyId: string, data: CreateRoomInput) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new AppError("Property not found", 404);
    }

    const room = await prisma.room.create({
      data: {
        propertyId,
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        capacity: data.capacity,
        bedType: data.bedType,
        bedCount: data.bedCount,
        imageUrl: data.imageUrl,
      },
      include: {
        Property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Ensure property's maxGuests reflects its rooms
    await this.ensurePropertyMaxGuests(propertyId);

    return room;
  }

  async getRoomsByProperty(propertyId: string) {
    const rooms = await prisma.room.findMany({
      where: { propertyId },
      include: {
        _count: {
          select: {
            Bookings: true,
            RoomAvailabilities: true,
            PriceAdjustments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rooms;
  }

  async getRoomById(roomId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        Property: {
          select: {
            id: true,
            name: true,
            tenantId: true,
          },
        },
        RoomAvailabilities: {
          take: 10,
          orderBy: { date: "asc" },
        },
        PriceAdjustments: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            Bookings: true,
            RoomAvailabilities: true,
            PriceAdjustments: true,
          },
        },
      },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    return room;
  }

  async updateRoom(roomId: string, data: Partial<UpdateRoomInput>) {
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: { Property: true },
    });

    if (!existingRoom) {
      throw new AppError("Room not found", 404);
    }

    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.bedType && { bedType: data.bedType }),
        ...(data.bedCount !== undefined && { bedCount: data.bedCount }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      },
      include: {
        Property: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Recalculate property's max guests in case capacity changed
    if (existingRoom?.Property?.id) {
      await this.ensurePropertyMaxGuests(existingRoom.Property.id);
    }

    return room;
  }

  async deleteRoom(roomId: string) {
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: {
            Bookings: true,
          },
        },
      },
    });

    if (!existingRoom) {
      throw new AppError("Room not found", 404);
    }

    if (existingRoom._count.Bookings > 0) {
      throw new AppError("Cannot delete room with existing bookings", 400);
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    // Recalculate property's max guests after deleting a room
    if (existingRoom?.propertyId) {
      await this.ensurePropertyMaxGuests(existingRoom.propertyId);
    }

    return { message: "Room deleted successfully" };
  }

  async getRoomAvailability(roomId: string, params: GetRoomAvailabilityInput) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const whereClause: any = {
      roomId,
      isAvailable: false, // Only get blocked dates
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

    const blockedDates = await prisma.roomAvailability.findMany({
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

    // Format dates to YYYY-MM-DD format for frontend consistency
    const formattedDates = blockedDates.map((item) => ({
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

    // Create blocked date records
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

    // Format dates to YYYY-MM-DD format for frontend consistency
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

    // Delete blocked date records (makes them available by default)
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

  async createPriceAdjustment(
    roomId: string,
    data: CreatePriceAdjustmentInput
  ) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const priceAdjustment = await prisma.priceAdjustment.create({
      data: {
        roomId,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        adjustType: data.adjustType,
        adjustValue: data.adjustValue,
        applyAllDates: data.applyAllDates,
        Dates:
          data.dates && !data.applyAllDates
            ? {
                create: data.dates.map((date) => ({
                  date: new Date(date),
                })),
              }
            : undefined,
      },
      include: {
        Dates: true,
      },
    });

    return {
      ...priceAdjustment,
      startDate: priceAdjustment.startDate.toISOString().split("T")[0],
      endDate: priceAdjustment.endDate.toISOString().split("T")[0],
      createdAt: priceAdjustment.createdAt.toISOString(),
      Dates: priceAdjustment.Dates.map((d) => ({
        ...d,
        date: d.date.toISOString().split("T")[0],
      })),
    };
  }

  async getPriceAdjustments(roomId: string) {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new AppError("Room not found", 404);
    }

    const priceAdjustments = await prisma.priceAdjustment.findMany({
      where: { roomId },
      include: {
        Dates: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return priceAdjustments.map((adjustment) => ({
      ...adjustment,
      startDate: adjustment.startDate.toISOString().split("T")[0],
      endDate: adjustment.endDate.toISOString().split("T")[0],
      createdAt: adjustment.createdAt.toISOString(),
      Dates: adjustment.Dates.map((d) => ({
        ...d,
        date: d.date.toISOString().split("T")[0],
      })),
    }));
  }

  async updatePriceAdjustment(
    adjustmentId: string,
    data: Partial<CreatePriceAdjustmentInput>
  ) {
    const existingAdjustment = await prisma.priceAdjustment.findUnique({
      where: { id: adjustmentId },
    });

    if (!existingAdjustment) {
      throw new AppError("Price adjustment not found", 404);
    }

    // If updating dates, first delete existing ones
    if (data.dates !== undefined) {
      await prisma.priceAdjustmentDate.deleteMany({
        where: { priceAdjustmentId: adjustmentId },
      });
    }

    const updatedAdjustment = await prisma.priceAdjustment.update({
      where: { id: adjustmentId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.adjustType && { adjustType: data.adjustType }),
        ...(data.adjustValue !== undefined && {
          adjustValue: data.adjustValue,
        }),
        ...(data.applyAllDates !== undefined && {
          applyAllDates: data.applyAllDates,
        }),
        ...(data.dates &&
          !data.applyAllDates && {
            Dates: {
              create: data.dates.map((date) => ({
                date: new Date(date),
              })),
            },
          }),
      },
      include: {
        Dates: true,
      },
    });

    return {
      ...updatedAdjustment,
      startDate: updatedAdjustment.startDate.toISOString().split("T")[0],
      endDate: updatedAdjustment.endDate.toISOString().split("T")[0],
      createdAt: updatedAdjustment.createdAt.toISOString(),
      Dates: updatedAdjustment.Dates.map((d) => ({
        ...d,
        date: d.date.toISOString().split("T")[0],
      })),
    };
  }

  async deletePriceAdjustment(adjustmentId: string) {
    const existingAdjustment = await prisma.priceAdjustment.findUnique({
      where: { id: adjustmentId },
    });

    if (!existingAdjustment) {
      throw new AppError("Price adjustment not found", 404);
    }

    await prisma.priceAdjustment.delete({
      where: { id: adjustmentId },
    });

    return { message: "Price adjustment deleted successfully" };
  }
}

export const roomService = new RoomService();
