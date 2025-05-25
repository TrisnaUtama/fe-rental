import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export const signInSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});