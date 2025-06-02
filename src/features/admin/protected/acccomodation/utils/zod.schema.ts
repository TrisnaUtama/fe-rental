import { z } from "zod";

export const AccomodationSchema = z.object({
  name: z.string().min(5, "name name must be at least 5 characters"),
  address: z.string().min(1, "address is required"),
  price_per_night: z.number().min(1, "price per night is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image_urls: z.array(z.instanceof(File), {
    required_error: "At least one image is required",
  }),
  facilities: z.array(
      z.string().min(3, "Facility name must be at least 3 characters")
    ),
});

export const UpdateAccomodationSchema = z.object({
  name: z.string().min(5, "name name must be at least 5 characters"),
  address: z.string().min(1, "address is required"),
  price_per_night: z.number().min(1, "price per night is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  new_images: z.array(z.instanceof(File), {
    required_error: "At least one image is required",
  }),
  image_urls: z.array(z.string()),
  status: z.boolean().optional().default(true),
  facilities: z.array(
      z.string().min(3, "Facility name must be at least 3 characters")
    ),
});
