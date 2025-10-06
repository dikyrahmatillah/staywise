import { Router } from "express";
import { webhookController } from "../controllers/webhook.controller.js";
import express from "express";

const router = Router();

// Raw body parser for webhook signature verification
const rawBodyParser = express.raw({ type: "application/json" });

// Midtrans webhook endpoint
router.post(
  "/midtrans",
  rawBodyParser,
  webhookController.handleMidtransWebhook.bind(webhookController)
);

export default router;
