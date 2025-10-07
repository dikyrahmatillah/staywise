import { resend } from "../configs/resend.config.js";
import fs from "node:fs/promises";
import Handlebars from "handlebars";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class EmailService {
  constructor() {
    Handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });
  }

  getDefaultFrom() {
    const envFrom = process.env.RESEND_FROM;
    if (envFrom && /.+@.+\..+/.test(envFrom)) return envFrom;
    if (envFrom && /.+<.+@.+>/.test(envFrom)) return envFrom;
    return "StayWise <mail@staywise.rent>";
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const webUrl = process.env.WEB_APP_URL || "http://localhost:3000";
    const resetLink = `${webUrl}/reset-password?token=${encodeURIComponent(
      resetToken
    )}`;

    const template = await fs.readFile(
      join(__dirname, "../templates/emails/password-reset.hbs"),
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ email, token: resetToken, resetLink });

    await resend.emails.send({
      from: this.getDefaultFrom(),
      to: email,
      subject: "Password Reset",
      html,
      text: `Use this link to reset your password: ${resetLink}`,
    });
  }

  async sendEmailVerification(email: string, verifyToken: string) {
    const webUrl = process.env.WEB_APP_URL || "http://localhost:3000";
    const verifyLink = `${webUrl}/complete-profile?token=${encodeURIComponent(
      verifyToken
    )}`;

    const template = await fs.readFile(
      join(__dirname, "../templates/emails/verify-email.hbs"),
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ verifyLink });

    await resend.emails.send({
      from: this.getDefaultFrom(),
      to: email,
      subject: "Verify your StayWise account",
      html,
      text: `Click to verify your email: ${verifyLink}`,
    });
  }

  async sendPaymentConfirmedEmail(
    email: string,
    bookingData: {
      customerName: string;
      brandName: string;
      bookingCode: string;
      propertyName: string;
      propertyAddress: string;
      guestCount: number;
      checkInDate: string;
      checkInTime: string;
      checkOutDate: string;
      checkOutTime: string;
      paymentMethod: string;
      amountPaid: string;
      currency: string;
      manageBookingUrl: string;
      mail: string;
      year: string;
    }
  ) {
    const template = await fs.readFile(
      join(__dirname, "../templates/emails/payment-confirmed.hbs"),
      "utf-8"
    );

    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate(bookingData);

    await resend.emails.send({
      from: this.getDefaultFrom(),
      to: email,
      subject: "Payment Confirmed – Your Stay is Booked!",
      html,
      text: `Hi ${bookingData.customerName}, your booking at ${bookingData.propertyName} is confirmed. 
Check-in: ${bookingData.checkInDate} ${bookingData.checkInTime}, 
Check-out: ${bookingData.checkOutDate} ${bookingData.checkOutTime}. 
Amount Paid: ${bookingData.currency}${bookingData.amountPaid}.
Manage your booking here: ${bookingData.manageBookingUrl}`,
    });
  }

  async sendEmailChangeVerification(newEmail: string, token: string) {
    const webUrl = process.env.WEB_APP_URL || "http://localhost:3000";
    const verifyLink = `${webUrl}/verify-email-change?token=${encodeURIComponent(
      token
    )}`;

    const template = await fs.readFile(
      join(__dirname, "../templates/emails/verify-email-change.hbs"),
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ verifyLink });

    await resend.emails.send({
      from: this.getDefaultFrom(),
      to: newEmail,
      subject: "Confirm your new email",
      html,
      text: `Click to confirm your new email: ${verifyLink}`,
    });
  }
}
