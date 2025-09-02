import { prisma } from "@repo/database";
import { LoginInput, UserRegistrationInput } from "@repo/schemas";
import { AppError } from "@/errors/app.error.js";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/jwt.js";
import { EmailService } from "./email.service.js";

export class AuthService {
  private emailService = new EmailService();

  async userRegistration(data: UserRegistrationInput) {
    if (await prisma.user.findUnique({ where: { email: data.email } })) {
      throw new AppError("User already exists", 409);
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
    return user;
  }

  async addPassword(userId: string, password: string, confirmation: string) {
    if (password !== confirmation)
      throw new AppError("Passwords do not match", 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) throw new AppError("Invalid email or password", 401);

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

  async updateProfile(userId: string, data: Partial<UserRegistrationInput>) {
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
