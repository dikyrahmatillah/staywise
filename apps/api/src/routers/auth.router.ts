import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";
import { verifyTokenMiddleware } from "@/middlewares/verifyToken.middleware.js";

const router = Router();
router.post("/signup", authController.startRegistration);
router.post(
  "/signup/complete",
  upload.single("avatarUrl"),
  authController.completeRegistration
);
router.post("/signin", authController.userLogin);
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);
router.get("/profile", verifyTokenMiddleware, authController.getProfile);
router.put(
  "/profile",
  verifyTokenMiddleware,
  upload.single("avatarUrl"),
  authController.editProfile
);
router.put(
  "/change-password",
  verifyTokenMiddleware,
  authController.changePassword
);

router.post(
  "/change-email",
  verifyTokenMiddleware,
  authController.requestChangeEmail
);
router.post("/change-email/confirm", authController.confirmChangeEmail);

export default router;
