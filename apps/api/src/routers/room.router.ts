import { Router } from "express";
import { roomController } from "../controllers/room.controller.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";
import { verifyRoleMiddleware } from "../middlewares/verifyRole.middleware.js";

const router = Router();

router.use(verifyTokenMiddleware);
router.use(verifyRoleMiddleware);

router.post("/property/:propertyId", roomController.createRoom);
router.get("/property/:propertyId", roomController.getRoomsByProperty);

router.get("/:roomId", roomController.getRoomById);
router.put("/:roomId", roomController.updateRoom);

router.delete("/:roomId", roomController.deleteRoom);

export default router;
