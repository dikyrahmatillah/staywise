import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";
import { EmailService } from "./email.service.js";
import bcrypt from "bcrypt";

export class PasswordResetService {
  private emailService = new EmailService();
  private static readonly RESET_TTL_MS = 15 * 60 * 1000;

  private async assertValidResetToken(token: string) {
    const pr = await prisma.passwordReset.findUnique({ where: { token } });
    if (!pr || pr.usedAt) throw new AppError("Invalid or used token", 400);
    if (pr.expiresAt.getTime() < Date.now())
      throw new AppError("Token expired", 400);
    return pr;
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    await prisma.passwordReset.deleteMany({ where: { userId: user.id } });

    const token = generateToken({ id: user.id, purpose: "reset" }, "15m");
    const expiresAt = new Date(Date.now() + PasswordResetService.RESET_TTL_MS);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, token);
    return { ok: true };
  }

  async resetPasswordWithToken(token: string, newPassword: string) {
    const pr = await this.assertValidResetToken(token);

    const user = await prisma.user.findUnique({ where: { id: pr.userId } });
    if (!user) throw new AppError("User not found", 404);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }
}
