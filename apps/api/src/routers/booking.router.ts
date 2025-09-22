// apps/api/src/routes/booking.router.ts
import { Router } from "express";
import { bookingController } from "@/controllers/booking.controller.js";
import { paymentProofController } from "@/controllers/payment-proof.controller.js";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware.js";
import {
  uploadPaymentProof,
  handleMulterError,
} from "@/middlewares/upload-payment-proof.middleware.js";
import { validateParams } from "@/middlewares/validate.middleware.js";
import { PaymentProofParamsSchema } from "@repo/schemas";

const router = Router();

router.use(verifyTokenMiddleware);

// Basic booking routes
router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBookingById);
router.patch("/:id/cancel", bookingController.cancelBooking);

// Payment proof routes
router.post(
  "/:orderId/payment-proof",
  validateParams(PaymentProofParamsSchema),
  uploadPaymentProof.single("paymentProof"),
  handleMulterError,
  paymentProofController.uploadPaymentProof
);

router.get(
  "/:orderId/payment-proof",
  validateParams(PaymentProofParamsSchema),
  paymentProofController.getPaymentProof
);

router.delete(
  "/:orderId/payment-proof",
  validateParams(PaymentProofParamsSchema),
  paymentProofController.deletePaymentProof
);

// Payment proof approval/rejection routes (for tenants)
router.patch(
  "/:orderId/payment-proof/approve",
  validateParams(PaymentProofParamsSchema),
  paymentProofController.approvePaymentProof
);

router.patch(
  "/:orderId/payment-proof/reject",
  validateParams(PaymentProofParamsSchema),
  paymentProofController.rejectPaymentProof
);

// Room availability check
router.get(
  "/availability/:propertyId/:roomId",
  bookingController.checkRoomAvailability
);

export default router;