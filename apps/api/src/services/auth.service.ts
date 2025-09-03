import { prisma } from "@repo/database";
import {
  CompleteRegistrationInput,
  LoginInput,
  RegistrationStartInput,
  UpdateUserInput,
} from "@repo/schemas";
import { AppError } from "@/errors/app.error.js";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/jwt.js";
import { EmailService } from "./email.service.js";

export class AuthService {
  private emailService = new EmailService();

  async startRegistration(input: RegistrationStartInput) {
    const { email, role } = input;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.emailVerified) {
      throw new AppError("User already exists", 409);
    }

    const user = existing
      ? existing
      : await prisma.user.create({
          data: {
            email,
            firstName: "",
            lastName: "",
            role: role as any,
            emailVerified: false,
          },
        });

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    const token = generateToken({ id: user.id, purpose: "verify" }, "1h");

    await prisma.emailVerification.deleteMany({ where: { userId: user.id } });
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.emailService.sendEmailVerification(email, token);
    return { ok: true };
  }

  async completeRegistration(input: CompleteRegistrationInput) {
    const { token, firstName, lastName, phone, avatarUrl, password } = input;

    const ver = await prisma.emailVerification.findUnique({
      where: { token },
    });
    if (!ver || ver.usedAt) throw new AppError("Invalid or used token", 400);
    if (ver.expiresAt.getTime() < Date.now())
      throw new AppError("Token expired", 400);

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
      prisma.emailVerification.update({
        where: { token },
        data: { usedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }

  async resendVerification(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    await prisma.emailVerification.deleteMany({ where: { userId: user.id } });

    const token = generateToken({ id: user.id, purpose: "verify" }, "1h");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    await this.emailService.sendEmailVerification(email, token);
    return { ok: true };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) throw new AppError("Invalid email or password", 401);

    if (!user.emailVerified) {
      throw new AppError("Email not verified", 403);
    }

    if (!user.password) throw new AppError("Invalid email or password", 401);

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    return user;
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

  async sendPasswordResetEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);
    const resetToken = generateToken({ id: user.id }, "1h");
    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }
}
