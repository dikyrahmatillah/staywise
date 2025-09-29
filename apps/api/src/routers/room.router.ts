import { Router } from "express";
import { roomController } from "../controllers/room.controller.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";
import { verifyRoleMiddleware } from "../middlewares/verifyRole.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/:roomId/unavailable-dates", roomController.getUnavailableDates);
router.get("/:roomId/availability", roomController.getRoomAvailability);

router.use(verifyTokenMiddleware);
router.use(verifyRoleMiddleware);

router.post(
  "/property/:propertyId",
  upload.single("imageFile"),
  roomController.createRoom
);
router.get("/property/:propertyId", roomController.getRoomsByProperty);

router.get("/:roomId", roomController.getRoomById);
router.put("/:roomId", upload.single("imageFile"), roomController.updateRoom);
router.delete("/:roomId", roomController.deleteRoom);

router.post("/:roomId/block", roomController.blockRoomDates);
router.post("/:roomId/unblock", roomController.unblockRoomDates);

router.get("/:roomId/price-adjustments", roomController.getPriceAdjustments);
router.post("/:roomId/price-adjustments", roomController.createPriceAdjustment);
router.put(
  "/price-adjustments/:adjustmentId",
  roomController.updatePriceAdjustment
);
router.delete(
  "/price-adjustments/:adjustmentId",
  roomController.deletePriceAdjustment
);

export default router;
