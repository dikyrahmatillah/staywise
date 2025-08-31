import { z } from "zod";

export const UserRegistrationSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "Firstname is required").max(150),
  lastName: z.string().min(1, "Invalid last name").max(150).optional(),
});

export const TenantRegistrationSchema = z.object({
  email: z.email("Invalid email"),
  firstName: z.string().min(1, "Firstname is required").max(150),
  lastName: z.string().min(1, "Invalid last name").max(150).optional(),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      "Phone number must be in international format, e.g. +6281234567890"
    )
    .optional(),
  propertyName: z.string().min(1, "Property name is required").max(150),
  city: z.string().min(1, "City is required").max(100),
});

export const SetPasswordSchema = z
  .object({
    token: z.string().min(6, "Invalid or missing token"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^\w\s]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const UpdateUserSchema = z.object({
  email: z.email("Invalid email").optional(),
  firstName: z.string().min(1, "Firstname is required").max(150).optional(),
  lastName: z.string().min(1, "Invalid last name").max(150).optional(),
  phone: z
    .string()
    .min(8, "Invalid phone number")
    .max(20, "Invalid phone number")
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      "Phone number must be in international format, e.g. +6281234567890"
    )
    .optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.email("Invalid email"),
});

export const ResendVerificationSchema = z.object({
  email: z.email("Invalid email"),
});

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>;
export type TenantRegistrationInput = z.infer<typeof TenantRegistrationSchema>;
export type SetPasswordInput = z.infer<typeof SetPasswordSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
