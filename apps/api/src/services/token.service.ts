import { prisma } from "@repo/database";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";
import { enqueueTokenExpiration } from "@/queues/token.queue.js";

export class TokenService {
  async generateEmailToken(
    userId: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "EMAIL_CHANGE",
    ttlMs: number,
    payload: Record<string, unknown> = {}
  ) {
    const expiresAt = new Date(Date.now() + ttlMs);
    const expiresInSeconds = Math.max(1, Math.floor(ttlMs / 1000));
    const token = generateToken(
      { id: userId, purpose: "verify", ...payload },
      expiresInSeconds
    );

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

    await enqueueTokenExpiration(token, ttlMs);

    return token;
  }

  async verifyEmailToken(
    token: string,
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "EMAIL_CHANGE"
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
