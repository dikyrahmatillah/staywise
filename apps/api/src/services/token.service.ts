import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";

export class TokenService {
  async generateEmailToken(
    userId: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
    ttlMs: number
  ) {
    const token = generateToken({ id: userId, purpose: "verify" }, "1h");
    const expiresAt = new Date(Date.now() + ttlMs);

    await prisma.$transaction(async (tx) => {
      await tx.authToken.updateMany({
        where: { userId, type, status: "ACTIVE" },
        data: { status: "REVOKED" },
      });

      await tx.authToken.create({
        data: {
          userId,
          type,
          token,
          expiresAt,
        },
      });
    });

    return token;
  }

  async verifyEmailToken(
    token: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET"
  ) {
    const tokenRecord = await prisma.authToken.findFirst({
      where: { token, type, status: "ACTIVE" },
    });

    if (!tokenRecord) throw new AppError("Invalid token", 400);
    if (tokenRecord.usedAt) throw new AppError("Token already used", 400);
    if (tokenRecord.expiresAt.getTime() < Date.now())
      throw new AppError("Token expired", 400);
    return tokenRecord;
  }
}
