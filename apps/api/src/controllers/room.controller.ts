import { NextFunction, Request, Response } from "express";
import { createRoomSchema, CreateRoomInput } from "@repo/schemas";
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
}

export const roomController = new RoomController();
