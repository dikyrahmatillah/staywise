import { prisma } from "@repo/database";
import {
  ChangePasswordInput,
  CompleteRegistrationInput,
  LoginInput,
  RegistrationStartInput,
  UpdateUserInput,
} from "@repo/schemas";
import { AppError } from "@/errors/app.error.js";
import { EmailService } from "./email.service.js";
import { TokenService } from "./token.service.js";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/jwt.js";
import { access } from "fs";

export class AuthService {
  private emailService = new EmailService();
  private tokenService = new TokenService();
  private static readonly VERIFY_TTL_MS = 60 * 60 * 1000;

  async startRegistration(input: RegistrationStartInput) {
    const { email, role } = input;
    const user =
      (await prisma.user.findUnique({ where: { email } })) ??
      (await prisma.user.create({ data: { email, firstName: "", role } }));

    if (user.emailVerified) throw new AppError("User already exists", 409);

    const token = await this.tokenService.generateEmailToken(
      user.id,
      "EMAIL_VERIFICATION",
      AuthService.VERIFY_TTL_MS
    );
    await this.emailService.sendEmailVerification(email, token);
    return { ok: true };
  }

  async completeRegistration(input: CompleteRegistrationInput) {
    const { token, firstName, lastName, phone, avatarUrl, password } = input;
    const ver = await this.tokenService.verifyEmailToken(
      token,
      "EMAIL_VERIFICATION"
    );

    const user = await prisma.user.findUnique({ where: { id: ver.userId } });
    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          phone,
          avatarUrl,
          password: hashedPassword,
          emailVerified: true,
        },
      }),
      prisma.authToken.update({
        where: { id: ver.id },
        data: { usedAt: new Date(), status: "USED" },
      }),
    ]);

    return { ok: true };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) throw new AppError("Invalid email or password", 401);
    if (!user.emailVerified) throw new AppError("Email not verified", 403);
    if (!user.password) throw new AppError("Invalid email or password", 401);

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) throw new AppError("Invalid email or password", 401);

    const token = generateToken({
      id: user.id,
      name: user.firstName,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: token,
    };
  }

  async userProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async updateProfile(userId: string, data: Partial<UpdateUserInput>) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
    });
    return updatedUser;
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);
    if (!user.password) throw new AppError("Password not set", 400);

    const isValidPassword = await bcrypt.compare(
      data.currentPassword,
      user.password
    );
    if (!isValidPassword) throw new AppError("Invalid current password", 401);

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  }
}
