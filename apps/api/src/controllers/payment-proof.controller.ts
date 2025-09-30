// apps/api/src/controllers/payment-proof.controller.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/database";
import { uploadToCloudinary } from "@/middlewares/upload-payment-proof.middleware.js";
import { AppError } from "@/errors/app.error.js";

export class PaymentProofController {
  async uploadPaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = request.params;
      const file = request.file;
      const userId = (request as any).user?.id;

      if (!file) {
        throw new AppError("Payment proof file is required", 400);
      }

      // Find booking by orderId (booking.id or booking.orderCode)
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          userId: userId,
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      // Check if booking is in correct status
      if (booking.status !== "WAITING_PAYMENT") {
        throw new AppError(
          "Payment proof can be uploaded only for bookings waiting for payment",
          400
        );
      }

      // Check if booking has expired
      if (booking.expiresAt && new Date() > booking.expiresAt) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELED" },
        });
        throw new AppError("Booking has expired and been cancelled", 400);
      }

      // Check if payment proof already exists
      const existingProof = await prisma.paymentProof.findUnique({
        where: { orderId: booking.id },
      });

      if (existingProof && !existingProof.rejectedAt) {
        throw new AppError(
          "Payment proof already uploaded for this booking",
          400
        );
      }

      // Upload to Cloudinary
      const filename = `payment-proof-${booking.orderCode}-${Date.now()}`;
      const uploadResult = await uploadToCloudinary(file.buffer, filename);

      // Create or update payment proof record
      const paymentProof = await prisma.paymentProof.upsert({
        where: { orderId: booking.id },
        create: {
          orderId: booking.id,
          uploadedBy: userId,
          imageUrl: uploadResult.secure_url,
        },
        update: {
          imageUrl: uploadResult.secure_url,
          uploadedAt: new Date(),
          rejectedAt: null,
          reviewedBy: null,
        },
      });

      // Update booking status to WAITING_CONFIRMATION
      const updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: "WAITING_CONFIRMATION",
          expiresAt: null,
        },
      });

      return response.status(201).json({
        success: true,
        message: "Payment proof uploaded successfully",
        data: {
          booking: updatedBooking,
          paymentProof,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getPaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = request.params;
      const userId = (request as any).user?.id;
      const userRole = (request as any).user?.role;

      // Find booking by orderId
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
        },
        include: {
          Property: { select: { tenantId: true } },
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      // Check access permissions
      const hasAccess =
        booking.userId === userId || // Guest owns booking
        (userRole === "TENANT" && booking.Property.tenantId === userId); // Tenant owns property

      if (!hasAccess) {
        throw new AppError("Access denied", 403);
      }

      // Find payment proof using booking.id as orderId
      const paymentProof = await prisma.paymentProof.findUnique({
        where: { orderId: booking.id },
        include: {
          UploadedBy: { select: { firstName: true, lastName: true } },
        },
      });

      if (!paymentProof) {
        throw new AppError("Payment proof not found", 404);
      }

      return response.json({
        success: true,
        data: paymentProof,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deletePaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = request.params;
      const userId = (request as any).user?.id;

      // Find booking by orderId
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          userId: userId,
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      // Find payment proof
      const paymentProof = await prisma.paymentProof.findUnique({
        where: { orderId: booking.id },
      });

      if (!paymentProof) {
        throw new AppError("Payment proof not found", 404);
      }

      // Only allow deletion if proof was rejected or booking is still waiting for payment
      if (booking.status !== "WAITING_PAYMENT" && !paymentProof.rejectedAt) {
        throw new AppError(
          "Cannot delete payment proof for confirmed bookings",
          400
        );
      }

      // Delete payment proof
      await prisma.paymentProof.delete({
        where: { id: paymentProof.id },
      });

      // Reset booking status to WAITING_PAYMENT if it was WAITING_CONFIRMATION
      if (booking.status === "WAITING_CONFIRMATION") {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "WAITING_PAYMENT",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Reset 1-hour timer
          },
        });
      }

      return response.json({
        success: true,
        message: "Payment proof deleted successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Simple approve method for tenants
  async approvePaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = request.params;
      const userId = (request as any).user?.id;
      const userRole = (request as any).user?.role;

      if (userRole !== "TENANT") {
        throw new AppError("Only tenants can approve payment proofs", 403);
      }

      // Find booking and verify tenant ownership
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          Property: { tenantId: userId },
        },
        include: {
          Room: { select: { name: true } },
          Property: { select: { name: true } },
        },
      });

      if (!booking) {
        throw new AppError("Booking not found or access denied", 404);
      }

      if (booking.status !== "WAITING_CONFIRMATION") {
        throw new AppError("Booking is not waiting for confirmation", 400);
      }

      // 🚨 CHECK FOR OVERLAPPING BOOKINGS
      console.log("🔍 Checking for overlapping bookings...");
      console.log("Current booking:", {
        id: booking.id,
        orderCode: booking.orderCode,
        roomId: booking.roomId,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
      });

      const overlappingBookings = await prisma.booking.findMany({
        where: {
          id: { not: booking.id }, // Exclude current booking
          roomId: booking.roomId,
          status: {
            in: [
              "WAITING_PAYMENT",
              "WAITING_CONFIRMATION",
              "PROCESSING",
              "COMPLETED",
            ],
          },
          OR: [
            // Case 1: Existing booking starts during this period
            {
              AND: [
                { checkInDate: { gte: booking.checkInDate } },
                { checkInDate: { lt: booking.checkOutDate } },
              ],
            },
            // Case 2: Existing booking ends during this period
            {
              AND: [
                { checkOutDate: { gt: booking.checkInDate } },
                { checkOutDate: { lte: booking.checkOutDate } },
              ],
            },
            // Case 3: Existing booking completely contains this period
            {
              AND: [
                { checkInDate: { lte: booking.checkInDate } },
                { checkOutDate: { gte: booking.checkOutDate } },
              ],
            },
          ],
        },
        select: {
          id: true,
          orderCode: true,
          status: true,
          checkInDate: true,
          checkOutDate: true,
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      console.log("Found overlapping bookings:", overlappingBookings.length);

      if (overlappingBookings.length > 0) {
        console.log(
          "❌ BLOCKING: Overlapping bookings detected!",
          overlappingBookings
        );

        // Format conflict details for error message
        const conflicts = overlappingBookings
          .map((b) => {
            const guestName =
              [b.User.firstName, b.User.lastName].filter(Boolean).join(" ") ||
              "Unknown Guest";
            return `${b.orderCode} (${guestName}, ${
              b.status
            }, ${b.checkInDate.toLocaleDateString()} - ${b.checkOutDate.toLocaleDateString()})`;
          })
          .join("; ");

        throw new AppError(
          `Cannot approve: Room "${booking.Room.name}" already has ${overlappingBookings.length} confirmed booking(s) for these dates. Conflicts: ${conflicts}`,
          409 // 409 Conflict status code
        );
      }

      console.log(
        "✅ No overlapping bookings found. Proceeding with approval..."
      );

      // Update payment proof and booking status
      await prisma.$transaction([
        prisma.paymentProof.update({
          where: { orderId: booking.id },
          data: {
            acceptedAt: new Date(),
            reviewedBy: userId,
          },
        }),
        prisma.booking.update({
          where: { id: booking.id },
          data: { status: "PROCESSING" },
        }),
      ]);

      console.log(
        "✅ Payment approved successfully for booking:",
        booking.orderCode
      );

      return response.json({
        success: true,
        message: "Payment proof approved successfully",
        data: { bookingId: booking.id, orderCode: booking.orderCode },
      });
    } catch (error: any) {
      next(error);
    }
  }

  // Simple reject method for tenants
  async rejectPaymentProof(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { orderId } = request.params;
      const userId = (request as any).user?.id;
      const userRole = (request as any).user?.role;

      if (userRole !== "TENANT") {
        throw new AppError("Only tenants can reject payment proofs", 403);
      }

      // Find booking and verify tenant ownership
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          Property: { tenantId: userId },
        },
      });

      if (!booking) {
        throw new AppError("Booking not found or access denied", 404);
      }

      if (booking.status !== "WAITING_CONFIRMATION") {
        throw new AppError("Booking is not waiting for confirmation", 400);
      }

      // Update payment proof and booking status
      await prisma.$transaction([
        prisma.paymentProof.update({
          where: { orderId: booking.id },
          data: {
            rejectedAt: new Date(),
            reviewedBy: userId,
          },
        }),
        prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "WAITING_PAYMENT",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Reset 1-hour timer
          },
        }),
      ]);

      return response.json({
        success: true,
        message: "Payment proof rejected successfully",
        data: {
          bookingId: booking.id,
          orderCode: booking.orderCode,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const paymentProofController = new PaymentProofController();
