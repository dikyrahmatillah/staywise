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

// Existing booking routes
router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
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
router.get("/:id", bookingController.getBookingById);
router.patch("/:id/cancel", bookingController.cancelBooking);
router.get(
  "/availability/:propertyId/:roomId",
  bookingController.checkRoomAvailability
);

export default router;
