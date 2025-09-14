import { NextFunction, Request, Response } from "express";
import {
  createRoomSchema,
  CreateRoomInput,
  blockRoomDatesSchema,
  unblockRoomDatesSchema,
  getRoomAvailabilitySchema,
  createPriceAdjustmentSchema,
} from "@repo/schemas";
import { roomService } from "@/services/room.service.js";

export class RoomController {
  createRoom = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = createRoomSchema.parse(request.body);
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
        message: "Room dates blocked successfully",
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
        message: "Room dates unblocked successfully",
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
}

export const roomController = new RoomController();
