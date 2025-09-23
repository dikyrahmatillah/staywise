import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "@repo/database";
import { OrderStatus } from "@repo/database/generated/prisma/index.js";
import { EmailService } from "@/services/email.service.js";

const emailService = new EmailService();

export class WebhookController {
  async handleMidtransWebhook(req: Request, res: Response) {
    try {
      const notification = req.body;
      console.log("Midtrans webhook received:", notification);

      // Verify signature for security
      const isValidSignature = this.verifyMidtransSignature(notification);
      if (!isValidSignature) {
        console.error("Invalid Midtrans signature");
        return res.status(401).json({ message: "Invalid signature" });
      }

      const { order_id, transaction_status, gross_amount } = notification;

      // Find booking by orderId from GatewayPayment
      const gatewayPayment = await prisma.gatewayPayment.findFirst({
        where: {
          OR: [{ providerRef: order_id }, { orderId: order_id }],
        },
        include: {
          Order: {
            include: {
              User: {
                select: { firstName: true, lastName: true, email: true },
              },
              Property: { select: { name: true, address: true, city: true } },
            },
          },
        },
      });

      if (!gatewayPayment) {
        console.error(`No payment found for order_id: ${order_id}`);
        return res.status(404).json({ message: "Order not found" });
      }

      const booking = gatewayPayment.Order;

      // Simple status mapping
      let newStatus: OrderStatus;
      let isSuccess = false;

      switch (transaction_status) {
        case "capture":
        case "settlement":
          newStatus = "COMPLETED";
          isSuccess = true;
          break;
        case "pending":
          newStatus = "PROCESSING";
          break;
        case "deny":
        case "cancel":
        case "expire":
        case "failure":
          newStatus = "CANCELED";
          break;
        default:
          newStatus = booking.status; // Keep current status
      }

      // Update booking status
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: newStatus,
          paidAt: isSuccess ? new Date() : null,
          updatedAt: new Date(),
        },
      });

      // Update gateway payment
      await prisma.gatewayPayment.update({
        where: { id: gatewayPayment.id },
        data: {
          status: transaction_status,
          paidAmount: isSuccess ? parseFloat(gross_amount) : null,
          paidAt: isSuccess ? new Date() : null,
        },
      });

      // Send confirmation email only for successful payments
      if (isSuccess && booking.User) {
        await this.sendPaymentConfirmation(booking);
      }

      res.status(200).json({
        message: "Webhook processed successfully",
        orderId: order_id,
        status: newStatus,
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private verifyMidtransSignature(notification: any): boolean {
    try {
      const { order_id, status_code, gross_amount, signature_key } =
        notification;
      const serverKey = process.env.MIDTRANS_SERVER_KEY;

      if (!serverKey) {
        console.error("MIDTRANS_SERVER_KEY not configured");
        return false;
      }

      const signatureKey = crypto
        .createHash("sha512")
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest("hex");

      return signatureKey === signature_key;
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  private async sendPaymentConfirmation(booking: any) {
    try {
      const customerName =
        `${booking.User.firstName || ""} ${
          booking.User.lastName || ""
        }`.trim() || "Customer";

      await emailService.sendPaymentConfirmedEmail(booking.User.email, {
        customerName,
        brandName: "StayWise",
        bookingCode: booking.orderCode,
        propertyName: booking.Property.name,
        propertyAddress: `${booking.Property.address}, ${booking.Property.city}`,
        guestCount: 1,
        checkInDate: booking.checkInDate.toISOString().split("T")[0],
        checkInTime: "14:00",
        checkOutDate: booking.checkOutDate.toISOString().split("T")[0],
        checkOutTime: "11:00",
        paymentMethod: "Online Payment",
        amountPaid: booking.totalAmount.toString(),
        currency: "IDR",
        manageBookingUrl: `${process.env.WEB_APP_URL}/dashboard/bookings/${booking.orderCode}`,
        supportEmail: "support@staywise.com",
        year: new Date().getFullYear().toString(),
      });

      console.log(`Payment confirmation email sent to ${booking.User.email}`);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }
  }
}

export const webhookController = new WebhookController();
