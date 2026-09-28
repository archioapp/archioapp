import { z } from "zod"

// Password requirements for signup and reset
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .refine((val) => /[A-Z]/.test(val), "Password must contain an uppercase letter")
  .refine((val) => /[0-9]/.test(val), "Password must contain a number")

export const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: passwordSchema,
  displayName: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
