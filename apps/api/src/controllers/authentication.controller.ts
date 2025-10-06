import {
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordWithTokenSchema,
  changePasswordSchema,
} from "../schemas/index.js";
import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../services/authentication.service.js";
import { PasswordResetService } from "../services/password.service.js";
import {
  UpdateUserSchema,
  changeEmailRequestSchema,
  changeEmailSchema,
} from "../schemas/index.js";
import { FileService } from "../services/file.service.js";

export class AuthenticationController {
  private authenticationService = new AuthenticationService();
  private passwordResetService = new PasswordResetService();
  private fileService = new FileService();

  login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = LoginSchema.parse(request.body);
      const result = await this.authenticationService.login(data);
      response.status(200).json({
        message: "User logged in successfully",
        data: result,
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

  changePassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = changePasswordSchema.parse(request.body);
      await this.authenticationService.changePassword(request.user.id, data);
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
      const userProfile = await this.authenticationService.getUserProfile(
        userId
      );
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
      const user = await this.authenticationService.getUserByEmail(email);
      response
        .status(200)
        .json({ message: "User fetched successfully", data: user });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
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

      const updatedUser = await this.authenticationService.updateProfile(
        request.user.id,
        data
      );

      response
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
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
      await this.authenticationService.requestChangeEmail(
        request.user.id,
        newEmail
      );
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
      await this.authenticationService.confirmChangeEmail(token);
      response.status(200).json({ message: "Email changed successfully" });
    } catch (error) {
      next(error);
    }
  };

  validateToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const token = String(request.query.token || "");
      const type = String(request.query.type || "");
      if (!token || !type) {
        response.status(400).json({ message: "Token and type are required" });
        return;
      }

      await this.authenticationService.validateToken(
        token,
        type as "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "EMAIL_CHANGE"
      );

      response.status(200).json({ message: "Token is valid" });
    } catch (error) {
      next(error);
    }
  };
}

export const authenticationController = new AuthenticationController();
