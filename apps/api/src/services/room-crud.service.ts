import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { CreateRoomInput, UpdateRoomInput } from "@repo/schemas";

export class RoomCrudService {
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
    } catch (err) {
      // Silently fail if property update fails
    }
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

    if (existingRoom?.propertyId) {
      await this.ensurePropertyMaxGuests(existingRoom.propertyId);
    }

    return { message: "Room deleted successfully" };
  }
}

export const roomCrudService = new RoomCrudService();
