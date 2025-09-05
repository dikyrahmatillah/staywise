import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";
import { EmailService } from "./email.service.js";
import bcrypt from "bcrypt";

export class PasswordResetService {
  private emailService = new EmailService();
  private static readonly RESET_TTL_MS = 15 * 60 * 1000;

  private async assertValidResetToken(token: string) {
    const candidates = await prisma.authToken.findMany({
      where: { type: "PASSWORD_RESET", status: "ACTIVE" },
    });

    for (const c of candidates) {
      if (!c.tokenHash) continue;
      const ok = await bcrypt.compare(token, c.tokenHash);
      if (!ok) continue;

      if (c.usedAt) throw new AppError("Invalid or used token", 400);
      if (c.expiresAt.getTime() < Date.now())
        throw new AppError("Token expired", 400);
      return c;
    }

    throw new AppError("Invalid or used token", 400);
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);
    await prisma.authToken.updateMany({
      where: { userId: user.id, type: "PASSWORD_RESET", status: "ACTIVE" },
      data: { status: "REVOKED" },
    });

    const token = generateToken({ id: user.id, purpose: "reset" }, "15m");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + PasswordResetService.RESET_TTL_MS);

    await prisma.authToken.create({
      data: {
        userId: user.id,
        type: "PASSWORD_RESET",
        tokenHash,
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
      prisma.authToken.update({
        where: { id: pr.id },
        data: { usedAt: new Date(), status: "USED" },
      }),
    ]);

    return { ok: true };
  }
}
