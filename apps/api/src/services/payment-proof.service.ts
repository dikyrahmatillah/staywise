import { prisma } from "../configs/prisma.config.js";
import { AppError } from "../errors/app.error.js";
import { cloudinary } from "../configs/cloudinary.config.js";
import { uploadToCloudinary } from "../middlewares/upload-payment-proof.middleware.js";
import type { OrderStatus } from "../generated/prisma/index.js";
type PaymentProofStatus = "accepted" | "rejected";

export class PaymentProofService {
  async uploadPaymentProof(
    orderId: string,
    uploadedBy: string,
    file: Express.Multer.File
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: orderId },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.userId !== uploadedBy) {
      throw new AppError(
        "You can only upload proof for your own bookings",
        403
      );
    }

    if (booking.status !== "WAITING_PAYMENT") {
      throw new AppError(
        "Payment proof can only be uploaded for bookings waiting for payment",
        400
      );
    }

    try {
      const filename = `${orderId}-${Date.now()}`;
      const cloudinaryResult = await uploadToCloudinary(file.buffer, filename);

      if (booking.paymentProof) {
        await this.deleteCloudinaryImage(booking.paymentProof.imageUrl);

        return prisma.paymentProof.update({
          where: { orderId },
          data: {
            imageUrl: cloudinaryResult.secure_url,
            uploadedAt: new Date(),
            acceptedAt: null,
            rejectedAt: null,
            reviewedBy: null,
          },
        });
      } else {
        return prisma.paymentProof.create({
          data: {
            orderId,
            uploadedBy,
            imageUrl: cloudinaryResult.secure_url,
          },
        });
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new AppError("Failed to upload image to cloud storage", 500);
    }
  }

  async getPaymentProof(orderId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: orderId },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.userId !== userId && booking.tenantId !== userId) {
      throw new AppError("Access denied", 403);
    }

    return booking.paymentProof;
  }

  async deletePaymentProof(orderId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: orderId },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.userId !== userId) {
      throw new AppError("You can only delete your own payment proof", 403);
    }

    if (!booking.paymentProof) {
      throw new AppError("No payment proof found", 404);
    }

    try {
      await this.deleteCloudinaryImage(booking.paymentProof.imageUrl);
      return prisma.paymentProof.delete({ where: { orderId } });
    } catch (error) {
      throw new AppError("Failed to delete payment proof", 500);
    }
  }

  private async deleteCloudinaryImage(imageUrl: string) {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Error deleting Cloudinary image:", error);
    }
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/payment-proofs\/([^\.]+)/);
      return matches ? `payment-proofs/${matches[1]}` : null;
    } catch (error) {
      return null;
    }
  }

  async reviewPaymentProof(
    orderId: string,
    reviewerId: string,
    status: PaymentProofStatus
  ) {
    const booking = await prisma.booking.findUnique({
      where: { id: orderId },
      include: { paymentProof: true },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (!booking.paymentProof) {
      throw new AppError("No payment proof uploaded yet", 400);
    }

    if (status === "accepted") {
      return prisma.$transaction([
        prisma.paymentProof.update({
          where: { orderId },
          data: {
            acceptedAt: new Date(),
            rejectedAt: null,
            reviewedBy: reviewerId,
          },
        }),
        prisma.booking.update({
          where: { id: orderId },
          data: { status: "COMPLETED" as OrderStatus },
        }),
      ]);
    }

    if (status === "rejected") {
      return prisma.$transaction([
        prisma.paymentProof.update({
          where: { orderId },
          data: {
            rejectedAt: new Date(),
            acceptedAt: null,
            reviewedBy: reviewerId,
          },
        }),
        prisma.booking.update({
          where: { id: orderId },
          data: { status: "WAITING_PAYMENT" as OrderStatus },
        }),
      ]);
    }

    return prisma.paymentProof.update({
      where: { orderId },
      data: { acceptedAt: null, rejectedAt: null, reviewedBy: reviewerId },
    });
  }
}

export const paymentProofService = new PaymentProofService();
