import {
  RegistrationStartSchema,
  CompleteRegistrationSchema,
  OAuthUserSchema,
} from "@repo/schemas";
import { NextFunction, Request, Response } from "express";
import { RegistrationService } from "../services/registration.service.js";
import { FileService } from "../services/file.service.js";

export class RegistrationController {
  private registrationService = new RegistrationService();
  private fileService = new FileService();

  startRegistration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = RegistrationStartSchema.parse(request.body);
      await this.registrationService.startRegistration(data);
      response.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      next(error);
    }
  };

  upsertUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data = OAuthUserSchema.parse(request.body);
      const result = await this.registrationService.upsertOAuthUser(data);
      response.status(200).json({
        message: "OAuth login successful",
        data: result,
      });
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

      await this.registrationService.completeRegistration(data);
      response.status(200).json({ message: "Registration completed" });
    } catch (error) {
      next(error);
    }
  };
}

export const registrationController = new RegistrationController();
