// modules/users/users.schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string().datetime(),
});

export const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

// �� Add new auth-specific schemas
export const AuthResponseDTO = z.object({
  user: userSchema,
  session: z
    .object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_at: z.number(),
    })
    .optional(),
});

export const UserResponseDTO = z.object({
  user: userSchema,
});

// 🆕 Add user management schemas for future
export const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  // Add more user fields as needed
});

// Types
export type User = z.infer<typeof userSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AuthResponseDTO = z.infer<typeof AuthResponseDTO>;
export type UserResponseDTO = z.infer<typeof UserResponseDTO>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
