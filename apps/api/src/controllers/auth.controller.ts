import {
  LoginSchema,
  UpdateUserSchema,
  RegistrationStartSchema,
  CompleteRegistrationSchema,
  ForgotPasswordSchema,
  changePasswordPassword,
} from "@repo/schemas";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "@/services/auth.service.js";
import { FileService } from "@/services/file.service.js";
import { PasswordResetService } from "@/services/password.service.js";

export class AuthController {
  private authService = new AuthService();
  private fileService = new FileService();
  private passwordResetService = new PasswordResetService();

  startRegistration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = RegistrationStartSchema.parse(request.body);
      await this.authService.startRegistration(data);
      response.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      next(error);
    }
  };

  completeRegistration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const profilePicture = request.file
        ? await this.fileService.uploadPicture(request.file.path)
        : undefined;

      const data = CompleteRegistrationSchema.parse({
        ...request.body,
        avatarUrl: profilePicture,
      });

      await this.authService.completeRegistration(data);
      response.status(200).json({ message: "Registration completed" });
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

  requestPasswordReset = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = ForgotPasswordSchema.parse(request.body);
      await this.passwordResetService.requestPasswordReset(email);
      response.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = changePasswordPassword.parse(request.body);
      await this.passwordResetService.resetPasswordWithToken(
        data.token,
        data.password
      );
      response.status(200).json({ message: "Password changed successfully" });
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
        avatarUrl: profilePicture,
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
