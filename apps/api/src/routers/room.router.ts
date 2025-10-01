import { Router } from "express";
import { roomCrudController } from "../controllers/room-crud.controller.js";
import { roomAvailabilityController } from "../controllers/room-availability.controller.js";
import { roomPricingController } from "../controllers/room-pricing.controller.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";
import { verifyRoleMiddleware } from "../middlewares/verifyRole.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get(
  "/:roomId/unavailable-dates",
  roomAvailabilityController.getUnavailableDates
);
router.get(
  "/:roomId/availability",
  roomAvailabilityController.getRoomAvailability
);

router.use(verifyTokenMiddleware);
router.use(verifyRoleMiddleware);

router.post(
  "/property/:propertyId",
  upload.single("imageFile"),
  roomCrudController.createRoom
);
router.get("/property/:propertyId", roomCrudController.getRoomsByProperty);

router.get("/:roomId", roomCrudController.getRoomById);
router.put(
  "/:roomId",
  upload.single("imageFile"),
  roomCrudController.updateRoom
);
router.delete("/:roomId", roomCrudController.deleteRoom);

router.post("/:roomId/block", roomAvailabilityController.blockRoomDates);
router.post("/:roomId/unblock", roomAvailabilityController.unblockRoomDates);

router.get(
  "/:roomId/price-adjustments",
  roomPricingController.getPriceAdjustments
);
router.post(
  "/:roomId/price-adjustments",
  roomPricingController.createPriceAdjustment
);
router.put(
  "/price-adjustments/:adjustmentId",
  roomPricingController.updatePriceAdjustment
);
router.delete(
  "/price-adjustments/:adjustmentId",
  roomPricingController.deletePriceAdjustment
);

export default router;
