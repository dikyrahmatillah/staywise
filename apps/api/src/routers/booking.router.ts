import { Router } from "express";
import { bookingController } from "../controllers/booking.controller.js";

const router = Router();
router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBookingById);
router.patch("/:id/cancel", bookingController.cancelBooking);
router.get("/availability/:propertyId/:roomId", bookingController.checkRoomAvailability);
export default router;
