import { Client } from "@upstash/qstash";

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

if (!QSTASH_TOKEN) {
  throw new Error(
    "Missing QStash config: set QSTASH_TOKEN environment variable"
  );
}

export const qstashClient = new Client({
  token: QSTASH_TOKEN,
});

export default qstashClient;
