import { Request, Response, NextFunction } from "express";
import * as bookingService from "../services/booking.service.js";

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

export async function getAllBookings(req: Request, res: Response) {
  try {
    const bookings = await bookingService.getAllBookings();

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(400).json({
      success: false,
      error: "Failed to fetch bookings",
    });
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
