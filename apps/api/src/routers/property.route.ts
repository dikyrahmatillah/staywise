import { Router } from "express";
import { propertyCreateController } from "../controllers/property-create.controller.js";
import { propertyQueryController } from "../controllers/property-query.controller.js";
import { propertyManageController } from "../controllers/property-manage.controller.js";
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
  propertyCreateController.createProperty
);
router.get("/", propertyQueryController.getProperties);
router.get(
  "/tenant/:tenantId",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyQueryController.getPropertiesByTenant
);

router.get(
  "/id/:id",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyQueryController.getPropertyById
);
router.put(
  "/id/:id",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  upload.fields([{ name: "propertyImages", maxCount: 10 }]),
  propertyManageController.updateProperty
);
router.delete(
  "/id/:propertyId",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  propertyManageController.deleteProperty
);

router.get("/:slug", propertyQueryController.getProperty);

export default router;
