import { z } from "zod";

export const OtpSchema = z.object({
  code: z.string().min(6, "Verification code must be filled"),
  user_id: z.string().min(1, "Verification code must be filled"),
  email: z.string()
})