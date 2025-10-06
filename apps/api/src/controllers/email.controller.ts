import { Request, Response } from "express";
import { EmailService } from "../services/email.service.js";

const emailService = new EmailService();

export class EmailController {
  static async sendTestPaymentConfirmed(req: Request, res: Response) {
    try {
      const { to } = req.query; // pass ?to=your@email.com
      if (!to || typeof to !== "string") {
        return res
          .status(400)
          .json({ error: "Missing or invalid 'to' email parameter" });
      }

      // Dummy booking data
      const bookingData = {
        customerName: "John Doe",
        brandName: "StayWise",
        bookingCode: "SW-123456",
        propertyName: "Seaside Villa",
        propertyAddress: "123 Ocean Drive, Bali",
        guestCount: 2,
        checkInDate: "2025-09-15",
        checkInTime: "14:00",
        checkOutDate: "2025-09-20",
        checkOutTime: "11:00",
        paymentMethod: "Credit Card",
        amountPaid: "500",
        currency: "USD",
        quietHours: "22:00 - 07:00",
        manageBookingUrl: "http://localhost:3000/dashboard/bookings/SW-123456",
        supportEmail: "support@staywise.com",
        year: new Date().getFullYear().toString(),
      };

      await emailService.sendPaymentConfirmedEmail(to, bookingData);

      res.json({ message: "Test Payment Confirmed email sent!", to });
    } catch (error) {
      console.error("Error sending test payment email:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  }
}
