import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(error);
  response.status(500).json({ message: "Internal Server Error" });
};
