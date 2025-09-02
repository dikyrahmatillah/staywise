import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";

const router = Router();
router.post("/register", authController.userRegister);
router.post("/login", authController.userLogin);
router.post("/add-password", authController.addPassword);
router.get("/profile", authController.getProfile);
router.put(
  "/profile",
  upload.single("profilePicture"),
  authController.editProfile
);

export default router;
