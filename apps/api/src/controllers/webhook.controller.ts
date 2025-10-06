import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../configs/prisma.config.js";
import { OrderStatus } from "../generated/prisma/index.js";
import { EmailService } from "../services/email.service.js";
import {
  formatBookingForEmail,
  validateBookingEmailData,
} from "../services/booking/helpers/email-data.helper.js";

const emailService = new EmailService();

export class WebhookController {
  async handleMidtransWebhook(req: Request, res: Response) {
    try {
      const notification = req.body;
      console.log("📩 Midtrans webhook received:", notification);

      // Verify signature for security
      const isValidSignature = this.verifyMidtransSignature(notification);
      if (!isValidSignature) {
        console.error("❌ Invalid Midtrans signature");
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
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              Property: {
                select: {
                  name: true,
                  address: true,
                  city: true,
                },
              },
              Room: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!gatewayPayment) {
        console.error(`❌ No payment found for order_id: ${order_id}`);
        return res.status(404).json({ message: "Order not found" });
      }

      const booking = gatewayPayment.Order;

      // Simple status mapping
      let newStatus: OrderStatus;
      let isSuccess = false;

      switch (transaction_status) {
        case "capture":
        case "settlement":
          newStatus = "PROCESSING"; // Changed from COMPLETED to PROCESSING
          isSuccess = true;
          console.log(`✅ Payment successful for order: ${order_id}`);
          break;
        case "pending":
          newStatus = "PROCESSING";
          console.log(`⏳ Payment pending for order: ${order_id}`);
          break;
        case "deny":
        case "cancel":
        case "expire":
        case "failure":
          newStatus = "CANCELED";
          console.log(
            `❌ Payment ${transaction_status} for order: ${order_id}`
          );
          break;
        default:
          newStatus = booking.status;
          console.log(`⚠️ Unknown transaction status: ${transaction_status}`);
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

      // 📧 SEND CONFIRMATION EMAIL ONLY FOR SUCCESSFUL PAYMENTS
      if (isSuccess && booking.User) {
        await this.sendPaymentConfirmation(booking);
      }

      res.status(200).json({
        message: "Webhook processed successfully",
        orderId: order_id,
        status: newStatus,
      });
    } catch (error) {
      console.error("❌ Webhook processing error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private verifyMidtransSignature(notification: any): boolean {
    try {
      const { order_id, status_code, gross_amount, signature_key } =
        notification;
      const serverKey = process.env.MIDTRANS_SERVER_KEY;

      if (!serverKey) {
        console.error("❌ MIDTRANS_SERVER_KEY not configured");
        return false;
      }

      const signatureKey = crypto
        .createHash("sha512")
        .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
        .digest("hex");

      return signatureKey === signature_key;
    } catch (error) {
      console.error("❌ Signature verification error:", error);
      return false;
    }
  }

  private async sendPaymentConfirmation(booking: any) {
    try {
      console.log("📧 Preparing to send payment confirmation email...");

      // Validate booking has required data
      const validation = validateBookingEmailData(booking);
      if (!validation.valid) {
        console.error(
          "⚠️ Cannot send email: Missing required data:",
          validation.missing
        );
        return;
      }

      // Format booking data for email
      const emailData = formatBookingForEmail(booking);

      // Send email
      await emailService.sendPaymentConfirmedEmail(
        booking.User.email,
        emailData
      );

      console.log(
        `✅ Payment confirmation email sent to ${booking.User.email} for booking ${booking.orderCode}`
      );
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
      // Don't throw - we don't want email failures to affect payment processing
    }
  }
}

export const webhookController = new WebhookController();
