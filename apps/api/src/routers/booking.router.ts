import { Router } from "express";
import * as bookingController from "../controllers/booking.controller.js";

const router = Router();
router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
router.get("/:id", bookingController.getBookingById);

export default router;
