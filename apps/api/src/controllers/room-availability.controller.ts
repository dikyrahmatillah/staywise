import { NextFunction, Request, Response } from "express";
import {
  blockRoomDatesSchema,
  unblockRoomDatesSchema,
  getRoomAvailabilitySchema,
} from "@repo/schemas";
import { roomAvailabilityService } from "@/services/room-availability.service.js";

export class RoomAvailabilityController {
  getRoomAvailability = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const query = getRoomAvailabilitySchema.parse(request.query);
      const availability = await roomAvailabilityService.getRoomAvailability(
        roomId,
        query
      );

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
      const result = await roomAvailabilityService.blockRoomDates(roomId, data);

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
      const result = await roomAvailabilityService.unblockRoomDates(
        roomId,
        data
      );

      response.status(200).json({
        message: "Room dates marked available successfully",
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
      const result = await roomAvailabilityService.getUnavailableDates(roomId);

      response.status(200).json({
        success: true,
        message: "Unavailable dates retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const roomAvailabilityController = new RoomAvailabilityController();
