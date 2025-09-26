import {
  LoginSchema,
  UpdateUserSchema,
  RegistrationStartSchema,
  CompleteRegistrationSchema,
  ForgotPasswordSchema,
  ResetPasswordWithTokenSchema,
  changePasswordSchema,
} from "@repo/schemas";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "@/services/auth.service.js";
import { FileService } from "@/services/file.service.js";
import { PasswordResetService } from "@/services/password.service.js";
import {
  changeEmailRequestSchema,
  changeEmailSchema,
  OAuthUserSchema,
} from "@repo/schemas";

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
        image: profilePicture,
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

  resetPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = ResetPasswordWithTokenSchema.parse(request.body);
      await this.passwordResetService.resetPasswordWithToken(data);
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

  getUserByEmail = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const email = String(request.query.email || "");
      if (!email) {
        response.status(400).json({ message: "Email is required" });
        return;
      }
      const user = await this.authService.userByEmail(email);
      response
        .status(200)
        .json({ message: "User fetched successfully", data: user });
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
        image: profilePicture,
      });

      const updatedUser = await this.authService.updateProfile(
        request.user.id,
        data
      );

      response.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
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
      const data = changePasswordSchema.parse(request.body);
      await this.authService.changePassword(request.user.id, data);
      response.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  };

  requestChangeEmail = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { newEmail } = changeEmailRequestSchema.parse(request.body);
      await this.authService.requestChangeEmail(request.user.id, newEmail);
      response.status(200).json({ message: "Email change verification sent" });
    } catch (error) {
      next(error);
    }
  };

  confirmChangeEmail = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = changeEmailSchema.parse(request.body);
      await this.authService.confirmChangeEmail(token);
      response.status(200).json({ message: "Email changed successfully" });
    } catch (error) {
      next(error);
    }
  };

  oauthUpsertUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = OAuthUserSchema.parse(request.body);
      const result = await this.authService.oauthUpsertUser(data);
      response.status(200).json({
        message: "OAuth login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
