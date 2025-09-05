import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";

const router = Router();
router.post("/signup", authController.startRegistration);
router.post(
  "/signup/complete",
  upload.single("avatarUrl"),
  authController.completeRegistration
);
router.post("/login", authController.userLogin);
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.get("/profile", authController.getProfile);
router.put("/profile", upload.single("avatarUrl"), authController.editProfile);

export default router;
