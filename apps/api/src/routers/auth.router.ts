import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();
router.post("/register", authController.userRegister);
router.post("/login", authController.userLogin);

export default router;
