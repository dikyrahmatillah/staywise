import { prisma } from "../configs/prisma.config.js";
import {
  RegistrationStartInput,
  CompleteRegistrationInput,
} from "../schemas/index.js";
import { AppError } from "../errors/app.error.js";
import { EmailService } from "./email.service.js";
import { TokenService } from "./token.service.js";
import { OAuthUserInput } from "../schemas/index.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export class RegistrationService {
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
      RegistrationService.VERIFY_TTL_MS
    );

    await this.emailService.sendEmailVerification(email, token);

    return { ok: true };
  }

  async completeRegistration(input: CompleteRegistrationInput) {
    const { token, firstName, lastName, phone, image, password } = input;

    const ver = await this.tokenService.verifyEmailToken(
      token,
      "EMAIL_VERIFICATION"
    );

    const user = await prisma.user.findUnique({ where: { id: ver.userId } });

    if (!user) throw new AppError("User not found", 404);
    if (user.emailVerified) throw new AppError("Email already verified", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const updated = await tx.authToken.updateMany({
        where: { id: ver.id, usedAt: null, status: "ACTIVE" },
        data: { usedAt: new Date(), status: "USED" },
      });
      if (updated.count !== 1) throw new AppError("Token already used", 400);

      await tx.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          phone,
          image,
          password: hashedPassword,
          emailVerified: new Date(),
          isOAuth: false,
        },
      });
    });

    return { ok: true };
  }

  async upsertOAuthUser(input: OAuthUserInput) {
    const email = input.email;
    const existing = await prisma.user.findUnique({ where: { email } });
    const desiredRole = input.role ?? "GUEST";

    if (existing && desiredRole === "TENANT" && existing.role !== "TENANT") {
      throw new AppError("Email already registered as guest", 409);
    }

    const nameFromInput = input.name?.trim();
    const [firstName, lastName] = nameFromInput?.split(" ") ?? [];
    const now = new Date();

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            firstName,
            lastName,
            name: nameFromInput,
            image: input.image,
            role: desiredRole === "TENANT" ? "TENANT" : undefined,
            emailVerified: existing.emailVerified ? undefined : now,
            isOAuth: true,
          },
        })
      : await prisma.user.create({
          data: {
            email,
            firstName,
            lastName,
            name: nameFromInput,
            image: input.image,
            role: desiredRole,
            emailVerified: new Date(),
            isOAuth: true,
          },
        });

    const accessToken = generateToken(
      {
        id: user.id,
        name: user.name ?? user.firstName ?? user.email,
        email: user.email,
        image: user.image,
        role: user.role,
      },
      "7d"
    );

    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }
}
