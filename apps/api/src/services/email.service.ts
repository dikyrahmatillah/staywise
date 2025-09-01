import { resend } from "@/configs/resend.config.js";
import fs from "node:fs/promises";
import Handlebars from "handlebars";

export class EmailService {
  constructor() {
    Handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const template = await fs.readFile(
      "./src/templates/password-reset.hbs",
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ resetToken });

    await resend.emails.send({
      from: "StayWise <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset",
      html,
      text: `Use this link to reset your password: ${resetToken}`,
    });
  }
}
