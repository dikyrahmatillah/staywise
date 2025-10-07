import { qstashClient } from "../configs/qstash.config.js";

export type TokenExpireJobData = {
  token: string;
};

export async function enqueueTokenExpiration(
  token: string,
  delayMs: number
): Promise<void> {
  try {
    const webhookUrl = `${process.env.API_BASE_URL}/api/webhooks/token-expiration`;

    const delaySeconds = Math.max(1, Math.floor(delayMs / 1000));

    await qstashClient.publishJSON({
      url: webhookUrl,
      body: {
        token,
      },
      delay: delaySeconds,
      retries: 3,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {}
}
