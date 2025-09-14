import { Request, Response, NextFunction } from "express";
import { bookingService } from "../services/booking/booking.service.js";

export class BookingController {
  async createBooking(
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

  async getAllBookings(req: Request, res: Response, next: NextFunction) {
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

  async getBookingById(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const booking = await bookingService.getBookingById(id);
      if (!booking) {
        return response.status(404).json({ error: "Booking not found" });
      }
      return response.json(booking);
    } catch (error: any) {
      next(error);
    }
  }

  async cancelBooking(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const booking = await bookingService.cancelBooking(id);
      return response.status(200).json({
        success: true,
        message: "Booking canceled successfully",
        data: booking,
      });
    } catch (error: any) {
      next(error);
    }
  }

    async checkRoomAvailability(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { propertyId, roomId } = request.params;
      const { checkIn, checkOut } = request.query;

      if (!checkIn || !checkOut) {
        return response.status(400).json({
          success: false,
          message: "checkIn and checkOut dates are required",
          data: null,
        });
      }

      const availability = await bookingService.checkRoomAvailability(
        propertyId,
        roomId,
        checkIn as string,
        checkOut as string
      );

      return response.json({
        success: true,
        data: availability,
      });
    } catch (error: any) {
      next(error);
    }
  }
}


export const bookingController = new BookingController();