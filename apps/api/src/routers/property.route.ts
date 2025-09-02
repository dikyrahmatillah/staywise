import { Router } from "express";
import { propertyController } from "../controllers/property.controller.js";

const router = Router();

router.post("/", propertyController.createProperty);
router.get("/", propertyController.getProperties);
router.get("/:slug", propertyController.getProperty);

export default router;
