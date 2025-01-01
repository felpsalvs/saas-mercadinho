import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
