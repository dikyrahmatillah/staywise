import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function verifyTokenMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

  request.user = decoded;
  next();
}
