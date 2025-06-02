import { z } from "zod";

export const VehicleSchema = z.object({
  name: z.string().min(5, "Vehicle name must be at least 5 characters"),
  type: z.string().min(1, "Vehicle Type is required"),
  transmition: z.string().min(1, "Vehicle Transmition is required"),
  status: z.string().min(1, "Vehicle Status is required"),
  fuel: z.string().min(1, "Vehicle Fuel is required"),
  brand: z.string().min(2, "Brand name must be at least 2 characters"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  kilometer: z.number().min(0, "Kilometer must be a positive number"),
  year: z.number().min(1900).max(new Date().getFullYear()),
  price_per_day: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
  image_url: z.array(z.instanceof(File), {
    required_error: "At least one image is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  color: z.string().min(2, "Color name must be at least 2 characters"),
});

export const UpdateVehicleSchema = z.object({
  name: z.string().min(5, "Vehicle name must be at least 5 characters"),
  type: z.string().min(1, "Vehicle Type is required"),
  transmition: z.string().min(1, "Vehicle Transmition is required"),
  status: z.string().min(1, "Vehicle Status is required"),
  fuel: z.string().min(1, "Vehicle Fuel is required"),
  brand: z.string().min(2, "Brand name must be at least 2 characters"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  kilometer: z.number().min(0, "Kilometer must be a positive number"),
  year: z.number().min(1900).max(new Date().getFullYear()),
  price_per_day: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal"),
  image_url: z.array(z.string()),
  new_images: z.array(z.instanceof(File), {
    required_error: "At least one image is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  color: z.string().min(2, "Color name must be at least 2 characters"),
});
