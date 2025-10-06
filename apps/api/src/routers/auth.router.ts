import { Router } from "express";
import { registrationController } from "../controllers/registration.controller.js";
import { authenticationController } from "../controllers/authentication.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyTokenMiddleware } from "../middlewares/verifyToken.middleware.js";

const router = Router();
router.post("/signup", registrationController.startRegistration);
router.post(
  "/signup/complete",
  upload.single("image"),
  registrationController.completeRegistration
);
router.post("/signin", authenticationController.login);
router.post("/forgot-password", authenticationController.requestPasswordReset);
router.post("/reset-password", authenticationController.resetPassword);
router.get("/validate-token", authenticationController.validateToken);
router.put(
  "/change-password",
  verifyTokenMiddleware,
  authenticationController.changePassword
);
router.get(
  "/profile",
  verifyTokenMiddleware,
  authenticationController.getProfile
);
router.get("/user", authenticationController.getUserByEmail);
router.put(
  "/profile",
  verifyTokenMiddleware,
  upload.single("image"),
  authenticationController.updateProfile
);
router.post(
  "/change-email",
  verifyTokenMiddleware,
  authenticationController.requestChangeEmail
);
router.post(
  "/change-email/confirm",
  authenticationController.confirmChangeEmail
);
router.post("/oauth", registrationController.upsertUser);

export default router;
