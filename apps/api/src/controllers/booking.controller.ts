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

  async getAllBookings(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const userRole = (request as any).user?.role;
      const userId = (request as any).user?.id;

      // Extract pagination and filter parameters
      const {
        propertyId,
        page = 1,
        limit = 10,
        search,
        status,
      } = request.query;

      // Convert to numbers and validate
      const pageNum = Math.max(1, parseInt(page as string));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string))); // Cap at 50

      let bookings;
      let total;

      const filters = {
        page: pageNum,
        limit: limitNum,
        search: search as string,
        status: status as string,
        propertyId: (propertyId as string) || undefined,
      };

      if (userRole === "GUEST") {
        const result = await bookingService.getBookingsWithPagination({
          ...filters,
          userId,
        });
        bookings = result.data;
        total = result.total;
      } else if (userRole === "TENANT") {
        if (propertyId) {
          // Verify tenant owns this property
          const hasAccess = await bookingService.verifyTenantPropertyAccess(
            userId,
            propertyId as string
          );
          if (!hasAccess) {
            return response.status(403).json({
              success: false,
              message: "Access denied: You don't own this property",
              data: null,
            });
          }
        }

        const result = await bookingService.getBookingsWithPagination({
          ...filters,
          tenantId: propertyId ? undefined : userId,
        });
        bookings = result.data;
        total = result.total;
      } else {
        return response.status(403).json({
          success: false,
          message: "Unauthorized: Invalid user role",
          data: null,
        });
      }

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return response.json({
        success: true,
        count: bookings.length,
        data: bookings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        propertyId: propertyId || null,
      });
    } catch (error: any) {
      next(error);
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

  // NEW: Reject payment proof (allows re-upload)
  async rejectPaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const userRole = (request as any).user?.role;
      const userId = (request as any).user?.id;

      // Only tenants can reject payment proofs
      if (userRole !== "TENANT") {
        return response.status(403).json({
          success: false,
          message: "Only tenants can reject payment proofs",
        });
      }

      const result = await bookingService.rejectPaymentProof(id, userId);
      return response.status(200).json({
        success: true,
        message:
          "Payment proof rejected. Guest can now re-upload payment proof.",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async approvePaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { id } = request.params;
      const userRole = (request as any).user?.role;
      const userId = (request as any).user?.id;

      // Only tenants can approve payment proofs
      if (userRole !== "TENANT") {
        return response.status(403).json({
          success: false,
          message: "Only tenants can approve payment proofs",
        });
      }

      const result = await bookingService.approvePaymentProof(id, userId);
      return response.status(200).json({
        success: true,
        message: "Payment proof approved successfully",
        data: result,
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
