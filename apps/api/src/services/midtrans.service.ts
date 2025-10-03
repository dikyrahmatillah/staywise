import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";

export class MidtransService {
  private serverKey = process.env.MIDTRANS_SERVER_KEY;
  private clientKey = process.env.MIDTRANS_CLIENT_KEY;
  private isProduction = process.env.NODE_ENV === "production";

  private get baseUrl() {
    return this.isProduction
      ? "https://api.midtrans.com"
      : "https://api.sandbox.midtrans.com";
  }

  async createSnapToken(booking: any) {
    if (!this.serverKey) {
      throw new AppError("Midtrans server key not configured", 500);
    }

    const parameter = {
      transaction_details: {
        order_id: booking.orderCode,
        gross_amount: booking.totalAmount,
      },
      customer_details: {
        first_name: booking.User.firstName,
        last_name: booking.User.lastName,
        email: booking.User.email,
      },
      item_details: [
        {
          id: booking.roomId,
          price: booking.pricePerNight,
          quantity: booking.nights,
          name: `${booking.Property.name} - ${booking.Room.name}`,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_WEB_URL}/booking/${booking.id}/payment-success`,
        error: `${process.env.NEXT_PUBLIC_WEB_URL}/booking/${booking.id}/payment-failed`,
        pending: `${process.env.NEXT_PUBLIC_WEB_URL}/booking/${booking.id}/payment-pending`,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/v1/payment-links`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(this.serverKey + ":").toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameter),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new AppError(
          `Midtrans error: ${result.error_messages?.[0] || "Unknown error"}`,
          400
        );
      }

      // Save to database
      await prisma.gatewayPayment.create({
        data: {
          orderId: booking.id,
          provider: "MIDTRANS",
          snapToken: result.token,
          redirectUrl: result.redirect_url,
          status: "pending",
          payload: result,
        },
      });

      return {
        snapToken: result.token,
        redirectUrl: result.redirect_url,
      };
    } catch (error) {
      throw new AppError("Failed to create payment", 500);
    }
  }

  async handleCallback(notification: any) {
    // Handle Midtrans webhook/callback
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;

    const booking = await prisma.booking.findUnique({
      where: { orderCode: orderId },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    // Update payment status
    await prisma.gatewayPayment.update({
      where: { orderId: booking.id },
      data: {
        status: transactionStatus,
        paidAt: ["settlement", "capture"].includes(transactionStatus)
          ? new Date()
          : null,
        paidAmount: ["settlement", "capture"].includes(transactionStatus)
          ? booking.totalAmount
          : null,
        payload: notification,
      },
    });

    // Update booking status
    if (["settlement", "capture"].includes(transactionStatus)) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "WAITING_CONFIRMATION" },
      });
    }

    return { success: true };
  }
}

export const midtransService = new MidtransService();
