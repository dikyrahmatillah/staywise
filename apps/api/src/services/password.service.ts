import { prisma } from "../configs/prisma.config.js";
import { ResetPasswordWithTokenInput } from "@repo/schemas";
import { AppError } from "../errors/app.error.js";
import { EmailService } from "./email.service.js";
import { TokenService } from "./token.service.js";
import bcrypt from "bcryptjs";

export class PasswordResetService {
  private emailService = new EmailService();
  private tokenService = new TokenService();
  private static readonly RESET_TTL_MS = 15 * 60 * 1000;

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);
    if (!user.emailVerified) throw new AppError("Email not verified", 400);

    const token = await this.tokenService.generateEmailToken(
      user.id,
      "PASSWORD_RESET",
      PasswordResetService.RESET_TTL_MS
    );

    await this.emailService.sendPasswordResetEmail(email, token);
    return { ok: true };
  }

  async resetPasswordWithToken(data: ResetPasswordWithTokenInput) {
    const tokenRecord = await this.tokenService.verifyEmailToken(
      data.token,
      "PASSWORD_RESET"
    );

    const user = await prisma.user.findUnique({
      where: { id: tokenRecord.userId },
    });
    if (!user) throw new AppError("User not found", 404);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await prisma.$transaction(async (tx) => {
      const updated = await tx.authToken.updateMany({
        where: { id: tokenRecord.id, usedAt: null, status: "ACTIVE" },
        data: { usedAt: new Date(), status: "USED" },
      });
      if (updated.count !== 1) throw new AppError("Token already used", 400);

      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    });

    return { ok: true };
  }
}
