import { Router } from "express";
import { propertyController } from "../controllers/property.controller.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";
import { verifyRoleMiddleware } from "../middlewares/verifyRole.middleware.js";

const router = Router();

router.post("/", propertyController.createProperty);
router.get("/", propertyController.getProperties);
router.get(
  "/tenant/:tenantId",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyController.getPropertiesByTenant
);
router.delete(
  "/:propertyId",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyController.deleteProperty
);
router.get("/:slug", propertyController.getProperty);

export default router;
