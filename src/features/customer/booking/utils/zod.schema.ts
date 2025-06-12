import { z } from "zod";

export const bookingSchema = z.object({
  vehicle_ids: z.array(z.string()).min(1, "Select at least one vehicle").optional(),
  start_date: z.string({ required_error: "Start date is required" }),
  end_date: z.string({ required_error: "End date is required" }),
  licences_id: z.string().min(1,"License is required"),
  card_id: z.string().min(1, "Card id is required"),
  pick_up_at_airport: z.boolean(),
  notes: z.string().optional(),
  promo_id: z.string().optional(),
  travel_package_id: z.string().optional(),
  pax_option_id: z.string().optional(),
});
