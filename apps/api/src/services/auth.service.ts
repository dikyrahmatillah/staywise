import { prisma } from "@repo/database";
import { CreateUserInput } from "@repo/schemas";

export class AuthService {
  async register(data: CreateUserInput) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
    return user;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }
}
