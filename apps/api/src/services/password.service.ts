import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";
import { EmailService } from "./email.service.js";
import { TokenService } from "./token.service.js";
import bcrypt from "bcrypt";

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

  async resetPasswordWithToken(token: string, newPassword: string) {
    const pr = await this.tokenService.verifyEmailToken(
      token,
      "PASSWORD_RESET"
    );

    const user = await prisma.user.findUnique({ where: { id: pr.userId } });
    if (!user) throw new AppError("User not found", 404);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.authToken.update({
        where: { id: pr.id },
        data: { usedAt: new Date(), status: "USED" },
      }),
    ]);

    return { ok: true };
  }
}
