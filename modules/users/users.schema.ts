import { z } from 'zod';

// 📌 Base user schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string().datetime(),
});

// 📌 Signup schema (inputs from client)
export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// 📌 Login schema (inputs from client)
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// 📌 Password reset schema
export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// Types for TypeScript
export type User = z.infer<typeof userSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
