import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";

export class TokenService {
  private static readonly VERIFY_TTL_MS = 60 * 60 * 1000;

  async generateEmailVerificationToken(userId: string) {
    const token = generateToken({ id: userId, purpose: "verify" }, "1h");
    const expiresAt = new Date(Date.now() + TokenService.VERIFY_TTL_MS);

    await prisma.$transaction(async (tx) => {
      await tx.authToken.updateMany({
        where: { userId, type: "EMAIL_VERIFICATION", status: "ACTIVE" },
        data: { status: "REVOKED" },
      });

      await tx.authToken.create({
        data: {
          userId,
          type: "EMAIL_VERIFICATION",
          token,
          expiresAt,
        },
      });
    });

    return token;
  }

  async verifyEmailToken(token: string) {
    const tokenRecord = await prisma.authToken.findFirst({
      where: { type: "EMAIL_VERIFICATION", status: "ACTIVE", token },
    });

    if (!tokenRecord) throw new AppError("Invalid token", 400);
    if (tokenRecord.usedAt) throw new AppError("Token already used", 400);
    if (tokenRecord.expiresAt.getTime() < Date.now())
      throw new AppError("Token expired", 400);
    return tokenRecord;
  }
}
