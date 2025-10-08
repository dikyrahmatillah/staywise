import { z } from "zod";
import { CompleteRegistrationSchema } from "@/schemas";

export const ResetPasswordClientSchema = z
  .object({
    password: CompleteRegistrationSchema.shape.password,
    confirmPassword: CompleteRegistrationSchema.shape.password,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordClientInput = z.infer<
  typeof ResetPasswordClientSchema
>;
