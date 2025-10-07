import { Router } from "express";
import { TokenExpirationController } from "../controllers/token-expiration.controller.js";

const router = Router();
const tokenExpirationController = new TokenExpirationController();

router.post(
  "/token-expiration",
  tokenExpirationController.expireToken.bind(tokenExpirationController)
);

export default router;
