import { Router } from "express";
import { propertyController } from "../controllers/property.controller.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";
import { verifyRoleMiddleware } from "../middlewares/verifyRole.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  upload.fields([
    { name: "propertyImages", maxCount: 10 },
    { name: "roomImages", maxCount: 20 },
  ]),
  propertyController.createProperty
);
router.get("/", propertyController.getProperties);
router.get(
  "/tenant/:tenantId",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyController.getPropertiesByTenant
);

router.get(
  "/id/:id",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyController.getPropertyById
);
router.put(
  "/id/:id",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  upload.fields([{ name: "propertyImages", maxCount: 10 }]),
  propertyController.updateProperty
);
router.delete(
  "/id/:propertyId",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyController.deleteProperty
);

router.get("/:slug", propertyController.getProperty);

export default router;
