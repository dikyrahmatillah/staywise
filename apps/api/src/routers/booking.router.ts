import { Router } from "express";
import { bookingController } from "../controllers/booking.controller.js";

const router = Router();
router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBookingById);
router.delete("/:id/cancel", bookingController.cancelBooking);

export default router;
