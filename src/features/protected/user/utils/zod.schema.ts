import { z } from "zod";

export const RoleValues = [
  "SUPERADMIN",
  "ADMIN_OPERATIONAL",
  "ADMIN_FINANCE",
  "DRIVER",
  "CUSTOMER",
] as const;

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "role is required"),
  status: z.string().min(1, "status is required"),
  year_of_experiences: z.number(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "role is required"),
  status: z.string().min(1, "status is required"),
  year_of_experiences: z.number().nullable(),
});

export const schemaTable = z.object({
  user_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone_number: z.string(),
  role: z.string(),
  is_verified: z.boolean(),
  status: z.string(),
  year_of_experiences: z.number(),
});
