import { Router } from "express";
import { EmailController } from "../controllers/email.controller.js";

const router = Router();

router.get("/test-payment-confirmed", EmailController.sendTestPaymentConfirmed);

export default router;
