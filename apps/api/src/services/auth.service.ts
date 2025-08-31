import { prisma } from "@repo/database";
import { LoginInput, UserRegistrationInput } from "@repo/schemas";
import { AppError } from "@/errors/app.error.js";
import bcrypt from "bcrypt";

export class AuthService {
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
}
