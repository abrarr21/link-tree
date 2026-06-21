import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain alphanumeric characters and underscores",
      ),
    email: z.string().email("invalid email format"),
    password: z.string().min(6, "password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("invalid email address"),
    password: z.string(),
  }),
});
