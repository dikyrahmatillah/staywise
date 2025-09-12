import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";
import { verifyRoleMiddleware } from "../middlewares/verifyRole.middleware.js";

const router = Router();

router.get(
  "/custom",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  categoryController.getCustomCategories
);
router.post(
  "/custom",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  categoryController.createCustomCategory
);
router.put(
  "/custom/:id",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  categoryController.updateCustomCategory
);
router.delete(
  "/custom/:id",
  verifyTokenMiddleware,
  verifyRoleMiddleware,
  categoryController.deleteCustomCategory
);
router.get("/default", categoryController.getDefaultCategories);

export default router;
