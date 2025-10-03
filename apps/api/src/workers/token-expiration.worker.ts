import { Worker, QueueEvents, Job } from "bullmq";
import { bullConnection } from "@/configs/redis.config.js";
import {
  TOKEN_EXPIRE_QUEUE,
  TokenExpireJobData,
} from "@/queues/token.queue.js";
import logger from "@/utils/logger.js";
import { prisma } from "@/configs/prisma.config.js";

const events = new QueueEvents(TOKEN_EXPIRE_QUEUE, {
  connection: bullConnection,
});
events.on("failed", (evt: { jobId: string; failedReason?: string }) => {
  logger.error(
    `Token expire job ${evt.jobId} failed: ${evt.failedReason ?? "unknown"}`
  );
});
events.on("completed", (evt: { jobId: string }) => {
  logger.info(`Token expire job ${evt.jobId} completed`);
});

export const tokenExpirationWorker = new Worker<TokenExpireJobData>(
  TOKEN_EXPIRE_QUEUE,
  async (job: Job<TokenExpireJobData>) => {
    const { token } = job.data;

    const tokenRecord = await prisma.authToken.findUnique({
      where: { token },
      select: { id: true, status: true, expiresAt: true, usedAt: true },
    });

    if (!tokenRecord) {
      logger.warn(`Token not found for expiration: ${token}`);
      return;
    }

    if (tokenRecord.usedAt || tokenRecord.status !== "ACTIVE") return;
    if (tokenRecord.expiresAt.getTime() > Date.now()) return;

    await prisma.authToken.update({
      where: { token },
      data: { status: "EXPIRED" },
    });
  },
  { connection: bullConnection }
);

process.on("SIGINT", async () => {
  await tokenExpirationWorker.close();
  await events.close();
});
