import { Request, Response, NextFunction } from "express";
import * as bookingService from "@/services/booking.service.js";

export async function createBooking(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const booking = await bookingService.createBooking(request.body);
    return response.status(201).json(booking);
  } catch (error: any) {
    next(error);
  }
}

export async function getBookingById(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { id } = request.params;
    const booking = await bookingService.getBookingById(id);
    if (!booking)
      return response.status(404).json({ error: "Booking not found" });
    return response.json(booking);
  } catch (error: any) {
    next(error);
  }
}
