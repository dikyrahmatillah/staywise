import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const requirePaymentProof = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = request.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return response.status(404).json({ error: "Booking not found" });
    }

    if (booking.status === "WAITING_PAYMENT") {
      return response.status(400).json({
        error: "Payment proof required before proceeding",
      });
    }

    next();
  } catch (error) {
    response.status(500).json({ error: "Validation failed" });
  }
};
