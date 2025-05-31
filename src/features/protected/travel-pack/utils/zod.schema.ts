import { z } from "zod";

export const TravelPackSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  duration: z
    .number()
    .int()
    .min(1, { message: "Duration must be at least 1 day" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size > 0, { message: "Image is required" })
        .refine((file) => file.type.startsWith("image/"), {
          message: "File must be an image",
        }),
      z.undefined(),
    ])
    .refine((file) => file?.type.startsWith("image/"), {
      message: "File must be an image",
    }),
  travel_package_destinations: z
    .array(
      z.object({
        destination_id: z
          .string()
          .min(1, { message: "Destination ID is required" }),
      })
    )
    .nonempty({ message: "At least one destination must be provided" }),
  pax_options: z
    .array(
      z.object({
        pax: z.number().min(1, { message: "Pax must be at least 1" }),
        price: z.number().min(0, { message: "Price must be >= 0" }),
      })
    )
    .nonempty({ message: "At least one pax option must be provided" }),
});

export const UpdateTravelPackSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string(),
  new_images: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "Image is required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File must be an image",
    })
    .optional(),
  duration: z
    .number()
    .int()
    .min(1, { message: "Duration must be at least 1 day" }),
  description: z.string().min(1, { message: "Description is required" }),
  travel_package_destinations: z
    .array(
      z.object({
        id: z.string().min(1, { message: "destination must is required" }),
        destination_id: z
          .string()
          .min(1, { message: "Destination ID is required" }),
      })
    )
    .nonempty({ message: "At least one destination must be provided" }),
  pax_options: z
    .array(
      z.object({
        id: z.string().min(1, { message: "pax must is required" }),
        pax: z.number().min(1, { message: "Pax must be at least 1" }),
        price: z.number().min(0, { message: "Price must be >= 0" }),
      })
    )
    .nonempty({ message: "At least one pax option must be provided" }),
});
