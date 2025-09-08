import { NextFunction, Request, Response } from "express";

export async function verifyRoleMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.user?.role !== "TENANT") {
    return response
      .status(403)
      .json({ message: "Access denied: Tenant role required" });
  }
  next();
}
