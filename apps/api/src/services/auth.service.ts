import { prisma } from "@repo/database";
import {
  CompleteRegistrationInput,
  LoginInput,
  RegistrationStartInput,
  UpdateUserInput,
} from "@repo/schemas";
import { AppError } from "@/errors/app.error.js";
import { generateToken } from "@/utils/jwt.js";
import { EmailService } from "./email.service.js";
import bcrypt from "bcrypt";

export class AuthService {
  private emailService = new EmailService();

  private static readonly VERIFY_TTL_MS = 60 * 60 * 1000;

  private async issueEmailVerificationToken(userId: string) {
    await prisma.authToken.updateMany({
      where: { userId, type: "EMAIL_VERIFICATION", status: "ACTIVE" },
      data: { status: "REVOKED" },
    });

    const token = generateToken({ id: userId, purpose: "verify" }, "1h");
    const tokenHash = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + AuthService.VERIFY_TTL_MS);

    await prisma.authToken.create({
      data: {
        userId,
        type: "EMAIL_VERIFICATION",
        tokenHash,
        expiresAt,
      },
    });

    return token;
  }

  private async assertValidVerifyToken(token: string) {
    const candidates = await prisma.authToken.findMany({
      where: { type: "EMAIL_VERIFICATION", status: "ACTIVE" },
    });

    for (const c of candidates) {
      if (!c.tokenHash) continue;
      const ok = await bcrypt.compare(token, c.tokenHash);
      if (!ok) continue;

      if (c.usedAt) throw new AppError("Invalid or used token", 400);
      if (c.expiresAt.getTime() < Date.now())
        throw new AppError("Token expired", 400);
      return c;
    }

    throw new AppError("Invalid or used token", 400);
  }

  async startRegistration(input: RegistrationStartInput) {
    const { email, role } = input;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.emailVerified) throw new AppError("User already exists", 409);

    const user = await prisma.user.create({
      data: {
        email,
        firstName: "",
        role,
      },
    });

    const token = await this.issueEmailVerificationToken(user.id);
    await this.emailService.sendEmailVerification(email, token);
    return { ok: true };
  }

  async completeRegistration(input: CompleteRegistrationInput) {
    const { token, firstName, lastName, phone, avatarUrl, password } = input;
    const ver = await this.assertValidVerifyToken(token);

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

  async resendVerification(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    const token = await this.issueEmailVerificationToken(user.id);
    await this.emailService.sendEmailVerification(email, token);
    return { ok: true };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) throw new AppError("Invalid email or password", 401);
    if (!user.emailVerified) throw new AppError("Email not verified", 403);
    if (!user.password) throw new AppError("Invalid email or password", 401);

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) throw new AppError("Invalid email or password", 401);

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
}
