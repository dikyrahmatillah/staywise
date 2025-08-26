import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name must be at least 3 characters"),
  email: z.email("Invalid email format"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
