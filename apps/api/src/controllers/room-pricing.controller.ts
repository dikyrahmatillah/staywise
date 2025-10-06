import { NextFunction, Request, Response } from "express";
import { createPriceAdjustmentSchema } from "@repo/schemas";
import { roomPricingService } from "../services/room-pricing.service.js";

export class RoomPricingController {
  createPriceAdjustment = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { roomId } = request.params;
      const data = createPriceAdjustmentSchema.parse(request.body);
      const result = await roomPricingService.createPriceAdjustment(
        roomId,
        data
      );

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
      const result = await roomPricingService.getPriceAdjustments(roomId);

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
      const result = await roomPricingService.updatePriceAdjustment(
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
      const result = await roomPricingService.deletePriceAdjustment(
        adjustmentId
      );

      response.status(200).json({
        message: "Price adjustment deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const roomPricingController = new RoomPricingController();
