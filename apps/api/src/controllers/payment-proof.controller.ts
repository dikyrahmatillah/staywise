import { Request, Response, NextFunction } from "express";
import { prisma } from "@/configs/prisma.config.js";
import { uploadToCloudinary } from "@/middlewares/upload-payment-proof.middleware.js";
import { AppError } from "@/errors/app.error.js";
import { EmailService } from "@/services/email.service.js";
import {
  formatBookingForEmail,
  validateBookingEmailData,
} from "@/services/booking/helpers/email-data.helper.js";

const emailService = new EmailService();

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

      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          userId: userId,
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      if (booking.status !== "WAITING_PAYMENT") {
        throw new AppError(
          "Payment proof can be uploaded only for bookings waiting for payment",
          400
        );
      }

      if (booking.expiresAt && new Date() > booking.expiresAt) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELED" },
        });
        throw new AppError("Booking has expired and been cancelled", 400);
      }

      const existingProof = await prisma.paymentProof.findUnique({
        where: { orderId: booking.id },
      });

      if (existingProof && !existingProof.rejectedAt) {
        throw new AppError(
          "Payment proof already uploaded for this booking",
          400
        );
      }

      const filename = `payment-proof-${booking.orderCode}-${Date.now()}`;
      const uploadResult = await uploadToCloudinary(file.buffer, filename);

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

      const hasAccess =
        booking.userId === userId ||
        (userRole === "TENANT" && booking.Property.tenantId === userId);

      if (!hasAccess) {
        throw new AppError("Access denied", 403);
      }

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

      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          userId: userId,
        },
      });

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      const paymentProof = await prisma.paymentProof.findUnique({
        where: { orderId: booking.id },
      });

      if (!paymentProof) {
        throw new AppError("Payment proof not found", 404);
      }

      if (booking.status !== "WAITING_PAYMENT" && !paymentProof.rejectedAt) {
        throw new AppError(
          "Cannot delete payment proof for confirmed bookings",
          400
        );
      }

      await prisma.paymentProof.delete({
        where: { id: paymentProof.id },
      });

      if (booking.status === "WAITING_CONFIRMATION") {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: "WAITING_PAYMENT",
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
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

  // ✅ UPDATED: Approve with email notification
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

      // Fetch booking with all necessary relations for email
      const booking = await prisma.booking.findFirst({
        where: {
          OR: [{ id: orderId }, { orderCode: orderId }],
          Property: { tenantId: userId },
        },
        include: {
          Room: { select: { name: true } },
          Property: { select: { name: true, address: true, city: true } },
          User: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      if (!booking) {
        throw new AppError("Booking not found or access denied", 404);
      }

      if (booking.status !== "WAITING_CONFIRMATION") {
        throw new AppError("Booking is not waiting for confirmation", 400);
      }

      // Check for overlapping bookings
      console.log("🔍 Checking for overlapping bookings...");
      const overlappingBookings = await prisma.booking.findMany({
        where: {
          id: { not: booking.id },
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
            {
              AND: [
                { checkInDate: { gte: booking.checkInDate } },
                { checkInDate: { lt: booking.checkOutDate } },
              ],
            },
            {
              AND: [
                { checkOutDate: { gt: booking.checkInDate } },
                { checkOutDate: { lte: booking.checkOutDate } },
              ],
            },
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

      if (overlappingBookings.length > 0) {
        console.log("❌ BLOCKING: Overlapping bookings detected!");
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
          409
        );
      }

      console.log("✅ No overlapping bookings. Approving payment...");

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

      // 📧 SEND PAYMENT CONFIRMATION EMAIL
      try {
        console.log("📧 Sending payment confirmation email...");

        // Validate booking has required data
        const validation = validateBookingEmailData(booking);
        if (!validation.valid) {
          console.error(
            "⚠️ Cannot send email: Missing required data:",
            validation.missing
          );
        } else {
          // Format booking data for email
          const emailData = formatBookingForEmail(booking);

          // Send email
          await emailService.sendPaymentConfirmedEmail(
            booking.User.email,
            emailData
          );

          console.log(
            `✅ Payment confirmation email sent to ${booking.User.email}`
          );
        }
      } catch (emailError) {
        // Log error but don't fail the approval
        console.error("❌ Failed to send confirmation email:", emailError);
      }

      return response.json({
        success: true,
        message: "Payment proof approved successfully",
        data: { bookingId: booking.id, orderCode: booking.orderCode },
      });
    } catch (error: any) {
      next(error);
    }
  }

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
            expiresAt: new Date(Date.now() + 60 * 60 * 1000),
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