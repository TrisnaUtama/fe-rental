import { z } from "zod";

export const DestinationSchema = z.object({
    name: z.string().min(5, "Destination name must be at least 5 characters"),
    start_open: z.string().min(1, "Start open is required"), 
    end_open: z.string().min(1, "End open is required"),     
    description: z.string().min(20, "Description must be at least 20 characters"),
    image_urls: z.array(z.instanceof(File), {
      required_error: "At least one image is required",
    }),
    address: z.string().min(5, "Address must be at least 5 characters"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    facilities: z.array(
      z.string().min(3, "Facility name must be at least 3 characters")
    ),
    status: z.boolean().optional().default(true),
    deleted_at: z.union([z.date(), z.null()]).optional().default(null),
  })
  .transform((data) => ({
    ...data,
    open_hour: `${data.start_open}-${data.end_open}`, 
  }));

export const UpdateDestinationSchema = z.object({
    name: z.string().min(5, "Destination name must be at least 5 characters"),
    start_open: z.string().min(1, "Start open is required"), 
    end_open: z.string().min(1, "End open is required"),     
    description: z.string().min(20, "Description must be at least 20 characters"),
    new_images: z.array(z.instanceof(File), {
      required_error: "At least one image is required",
    }),
    image_urls: z.array(z.string()),
    address: z.string().min(5, "Address must be at least 5 characters"),
    category: z.string().min(3, "Category must be at least 3 characters"),
    facilities: z.array(
      z.string().min(3, "Facility name must be at least 3 characters")
    ),
    status: z.boolean().optional().default(true),
    deleted_at: z.union([z.date(), z.null()]).optional().default(null),
  })
  .transform((data) => ({
    ...data,
    open_hour: `${data.start_open}-${data.end_open}`, 
  }));

