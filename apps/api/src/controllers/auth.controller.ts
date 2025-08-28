import { AuthService } from "../services/auth.service.js";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  private authService = new AuthService();

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email } = request.body;
      const user = await this.authService.register({ name, email });
      response.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
