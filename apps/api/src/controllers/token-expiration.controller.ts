import { Request, Response } from "express";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { prisma } from "../configs/prisma.config.js";

export class TokenExpirationController {
  async expireToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const tokenRecord = await prisma.authToken.findFirst({
        where: { token },
      });

      if (!tokenRecord) {
        return res.status(200).json({
          message: "Token not found, might be already processed",
        });
      }

      if (tokenRecord.status === "EXPIRED" || tokenRecord.usedAt) {
        return res.status(200).json({
          message: "Token already processed",
        });
      }

      await prisma.authToken.update({
        where: { id: tokenRecord.id },
        data: { status: "EXPIRED" },
      });

      console.log(`✅ Token expired: ${token.substring(0, 20)}...`);

      return res.status(200).json({
        success: true,
        message: "Token expired successfully",
      });
    } catch (error) {
      console.error("❌ Error expiring token:", error);
      return res.status(500).json({
        error: "Failed to expire token",
      });
    }
  }

  async verifyQStashSignature(req: Request, res: Response, next: Function) {
    try {
      const signature = req.headers["upstash-signature"] as string;

      if (!signature) {
        return res.status(401).json({
          error: "Missing QStash signature",
        });
      }

      next();
    } catch (error) {
      console.error("❌ QStash signature verification failed:", error);
      return res.status(401).json({
        error: "Invalid QStash signature",
      });
    }
  }
}
