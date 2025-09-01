import {
  LoginSchema,
  UserRegistrationSchema,
  UpdateUserSchema,
} from "@repo/schemas";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { FileService } from "@/services/file.service.js";

export class AuthController {
  private authService = new AuthService();
  private fileService = new FileService();

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

  addPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { password, confirmation } = request.body;
      await this.authService.addPassword(
        request.user.id,
        password,
        confirmation
      );
      response.status(200).json({
        message: "Password added successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user.id;
      const userProfile = await this.authService.userProfile(userId);
      response.status(200).json({
        message: "User profile fetched successfully",
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  editProfile = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const profilePicture = request.file
        ? await this.fileService.uploadPicture(request.file.path)
        : undefined;

      const data = UpdateUserSchema.parse({
        ...request.body,
        profilePicture,
      });

      await this.authService.updateProfile(request.user.id, data);

      response.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
