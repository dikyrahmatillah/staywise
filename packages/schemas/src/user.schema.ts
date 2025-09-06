import { email, z } from "zod";

export const EmailSchema = z.email("Invalid email");
export const CommonProfileSchema = z.object({
  firstName: z.string().min(1, "Firstname is required").max(150),
  lastName: z.string().min(1, "Invalid last name").max(150).optional(),
  phone: z
    .string()
    .min(8, "Invalid phone number")
    .max(20, "Invalid phone number")
    .optional(),
  avatarUrl: z.url("Invalid avatar URL").optional(),
});

export const RegistrationStartSchema = z.object({
  email: EmailSchema,
  role: z.enum(["USER", "TENANT"]),
});

export const CompleteRegistrationSchema = CommonProfileSchema.extend({
  token: z.string().min(6, "Invalid or missing token"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^\w\s]/, "Password must contain at least one special character"),
});

export const CompleteRegistrationClientSchema =
  CompleteRegistrationSchema.extend({
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const UpdateUserSchema = CommonProfileSchema.partial().extend({
  email: EmailSchema.optional(),
});

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});

export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordWithTokenSchema = CompleteRegistrationSchema.pick({
  token: true,
  password: true,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: CompleteRegistrationSchema.shape.password,
});

export const changeEmailSchema = z.object({
  token: CompleteRegistrationSchema.shape.token,
  newEmail: EmailSchema,
});

export const changeEmailRequestSchema = z.object({
  newEmail: EmailSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegistrationStartInput = z.infer<typeof RegistrationStartSchema>;
export type CompleteRegistrationInput = z.infer<
  typeof CompleteRegistrationSchema
>;
export type CompleteRegistrationClientInput = z.infer<
  typeof CompleteRegistrationClientSchema
>;
export type ResetPasswordWithTokenInput = z.infer<
  typeof ResetPasswordWithTokenSchema
>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type changeEmailInput = z.infer<typeof changeEmailSchema>;
export type changeEmailRequestInput = z.infer<typeof changeEmailRequestSchema>;
