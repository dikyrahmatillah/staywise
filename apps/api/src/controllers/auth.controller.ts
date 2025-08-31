import { LoginSchema, UserRegistrationSchema } from "@repo/schemas";
import { AuthService } from "../services/auth.service.js";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  private authService = new AuthService();

  userRegister = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = UserRegistrationSchema.parse(request.body);
      const user = await this.authService.userRegistration(data);
      response.status(201).json({
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  userLogin = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = LoginSchema.parse(request.body);
      const user = await this.authService.login(data);
      response.status(200).json({
        message: "User logged in successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
