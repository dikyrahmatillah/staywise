import { Queue } from "bullmq";
import { bullConnection } from "../configs/redis.config.js";

export type TokenExpireJobData = {
  token: string;
};

export const TOKEN_EXPIRE_QUEUE = "token-expire" as const;

export const tokenExpireQueue = new Queue<TokenExpireJobData>(
  TOKEN_EXPIRE_QUEUE,
  {
    connection: bullConnection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: 50,
    },
  }
);

export async function enqueueTokenExpiration(token: string, delayMs: number) {
  await tokenExpireQueue.add(
    TOKEN_EXPIRE_QUEUE,
    { token },
    { delay: Math.max(0, delayMs), jobId: token }
  );
}
