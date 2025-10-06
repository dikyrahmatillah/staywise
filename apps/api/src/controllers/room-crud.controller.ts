import { NextFunction, Request, Response } from "express";
import { createRoomSchema } from "@repo/schemas";
import { roomCrudService } from "../services/room-crud.service.js";
import { FileService } from "../services/file.service.js";

export class RoomCrudController {
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
      const room = await roomCrudService.createRoom(propertyId, data);

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
      const rooms = await roomCrudService.getRoomsByProperty(propertyId);

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
      const room = await roomCrudService.getRoomById(roomId);

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

      const room = await roomCrudService.updateRoom(roomId, data);

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
      await roomCrudService.deleteRoom(roomId);

      response.status(200).json({
        message: "Room deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const roomCrudController = new RoomCrudController();
