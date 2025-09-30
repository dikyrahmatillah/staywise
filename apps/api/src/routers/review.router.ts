import { Router } from "express";
import { reviewController } from "@/controllers/review.controller.js";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware.js";

const router = Router();

// Public routes
router.get("/property/:propertyId/stats", reviewController.getPropertyReviewStats);
router.get("/", reviewController.getReviews);

// Protected routes
router.use(verifyTokenMiddleware);

router.post("/", reviewController.createReview);
router.get("/booking/:bookingId", reviewController.getReviewByBooking);
router.get("/booking/:bookingId/can-review", reviewController.canReviewBooking);
router.put("/:reviewId", reviewController.updateReview);
router.delete("/:reviewId", reviewController.deleteReview);

export default router;