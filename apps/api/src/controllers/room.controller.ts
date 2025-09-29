import { NextFunction, Request, Response } from "express";
import {
  createRoomSchema,
  blockRoomDatesSchema,
  unblockRoomDatesSchema,
  getRoomAvailabilitySchema,
  createPriceAdjustmentSchema,
} from "@repo/schemas";
import { roomService } from "@/services/room.service.js";
import { FileService } from "@/services/file.service.js";
import { prisma } from "@repo/database";

export class RoomController {
  private fileService = new FileService();

  createRoom = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = createRoomSchema.parse(request.body);

      if (request.file) {
        const secureUrl = await this.fileService.uploadPicture(
          request.file.path
        );
        data.imageUrl = secureUrl;
      }
      const { propertyId } = request.params;

      const room = await roomService.createRoom(propertyId, data);
      response.status(201).json({
        message: "Room created successfully",
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };

  getRoomsByProperty = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { propertyId } = request.params;
      const rooms = await roomService.getRoomsByProperty(propertyId);

      response.status(200).json({
        message: "Rooms retrieved successfully",
        data: rooms,
      });
    } catch (error) {
      next(error);
    }
  };

  getRoomById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const room = await roomService.getRoomById(roomId);

      response.status(200).json({
        message: "Room retrieved successfully",
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };

  updateRoom = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const data = createRoomSchema.partial().parse(request.body);

      if (request.file) {
        const secureUrl = await this.fileService.uploadPicture(
          request.file.path
        );
        data.imageUrl = secureUrl;
      }

      const room = await roomService.updateRoom(roomId, data);
      response.status(200).json({
        message: "Room updated successfully",
        data: room,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteRoom = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      await roomService.deleteRoom(roomId);

      response.status(200).json({
        message: "Room deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getRoomAvailability = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const query = getRoomAvailabilitySchema.parse(request.query);
      const availability = await roomService.getRoomAvailability(roomId, query);

      response.status(200).json({
        message: "Room availability retrieved successfully",
        data: availability,
      });
    } catch (error) {
      next(error);
    }
  };

  blockRoomDates = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const data = blockRoomDatesSchema.parse(request.body);
      const result = await roomService.blockRoomDates(roomId, data);

      response.status(200).json({
        message: "Room dates marked unavailable successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  unblockRoomDates = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const data = unblockRoomDatesSchema.parse(request.body);
      const result = await roomService.unblockRoomDates(roomId, data);

      response.status(200).json({
        message: "Room dates marked available successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  createPriceAdjustment = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const data = createPriceAdjustmentSchema.parse(request.body);
      const result = await roomService.createPriceAdjustment(roomId, data);

      response.status(201).json({
        message: "Price adjustment created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getPriceAdjustments = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const result = await roomService.getPriceAdjustments(roomId);

      response.status(200).json({
        message: "Price adjustments retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePriceAdjustment = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { adjustmentId } = request.params;
      const data = createPriceAdjustmentSchema.partial().parse(request.body);
      const result = await roomService.updatePriceAdjustment(
        adjustmentId,
        data
      );

      response.status(200).json({
        message: "Price adjustment updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePriceAdjustment = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { adjustmentId } = request.params;
      const result = await roomService.deletePriceAdjustment(adjustmentId);

      response.status(200).json({
        message: "Price adjustment deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

getUnavailableDates = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = request.params;
    
    // Get all confirmed/active bookings for this room
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        status: {
          in: ["WAITING_PAYMENT", "WAITING_CONFIRMATION", "PROCESSING", "COMPLETED"]
        }
      },
      select: {
        checkInDate: true,
        checkOutDate: true,
      }
    });

    // Get manually blocked dates from RoomAvailability
    const blockedDates = await prisma.roomAvailability.findMany({
      where: {
        roomId,
        isAvailable: false,
      },
      select: {
        date: true,
      }
    });

    // Convert bookings to array of date strings
    const unavailableDates: string[] = [];
    
    // Add all dates from bookings
    bookings.forEach(booking => {
      const current = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);
      
      // 🔧 FIX: Format dates without timezone issues
      while (current < end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        unavailableDates.push(`${year}-${month}-${day}`);
        current.setDate(current.getDate() + 1);
      }
    });

    // Add manually blocked dates
    blockedDates.forEach(blocked => {
      const date = new Date(blocked.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      if (!unavailableDates.includes(dateStr)) {
        unavailableDates.push(dateStr);
      }
    });

    response.status(200).json({
      success: true,
      message: "Unavailable dates retrieved successfully",
      data: {
        roomId,
        unavailableDates: [...new Set(unavailableDates)].sort(),
      },
    });
  } catch (error) {
    next(error);
  }
};
}

export const roomController = new RoomController();
