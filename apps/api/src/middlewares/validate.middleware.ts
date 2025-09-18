import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "@/errors/app.error.js";

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(`Invalid parameters: ${error.message}`, 400);
      }
      throw new AppError("Invalid parameters", 400);
    }
  };
};

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(`Invalid request body: ${error.message}`, 400);
      }
      throw new AppError("Invalid request body", 400);
    }
  };
};