import { Redis } from "@upstash/redis";
import type { ConnectionOptions } from "bullmq";

const UPSTASH_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!UPSTASH_REST_URL || !UPSTASH_REST_TOKEN) {
  throw new Error(
    "Missing Upstash config: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables"
  );
}

export const redis = new Redis({
  url: UPSTASH_REST_URL,
  token: UPSTASH_REST_TOKEN,
});
export type RedisClient = typeof redis;

export const bullConnection: ConnectionOptions =
  redis as unknown as ConnectionOptions;

export default redis;
