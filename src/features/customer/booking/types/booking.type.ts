import type { ITravelPack, TravelPax } from "@/features/admin/protected/travel-pack/types/travel-pack";
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type";
import type { IUser } from "@/features/auth/types/auth.type";

export type RescheduleStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface CreateBookingPayload {
  promo_id?: string | null;
  travel_package_id?: string | null;
  vehicle_ids?: string[];
  selected_pax?: string;
  licences_id: string;
  card_id: string;
  pick_up_at_airport: boolean;
  notes?: string | null;
  start_date: string;
  end_date?: string | null;
}

export interface UpdateBookingPayload {
  promo_id?: string | null;
  travel_package_id?: string | null;
  vehicle_ids?: string[];
  selected_pax?: string;
  licences_id: string;
  card_id: string;
  status?: string;
  pick_up_at_airport: boolean;
  notes?: string | null;
  start_date: string;
  end_date?: string | null;
}

export interface RescheduleRequestResponse {
  admin_notes: any;
  reason: any;
  id: string;
  booking_id: string;
  new_start_date: string;
  new_end_date: string;  
  status: RescheduleStatus;
  created_at?: string;    
  updated_at?: string;    
}

export interface BookingResponse {
  id: string;
  user_id: string;
  promo_id?: string | null;
  travel_package_id?: string | null;
  pax_option?: TravelPax
  status?: string;
  start_date: string;
  end_date?: string | null;
  total_price?: string;
  card_id: string;
  licences_id: string;
  pick_up_at_airport: boolean;
  notes?: string | null;

  created_at: string;
  updated_at: string;
  deleted_at?: string | null;

  promos?: Promo | null;
  travel_package?: ITravelPack | null;
  booking_vehicles?: IBookingVehicle[];
  Payments?: Payment[];
  vehicles?: IVehicle[];
  users? :IUser
  RescheduleRequests?: RescheduleRequestResponse[];
  Refunds?: RefundResponse[];
}

export interface UnavailableDatesResponse {
  unavailableDates: Record<string, string[]>;
}

export interface SearchPayload {
  start_date: string;
  end_date: string;
}

export interface RequestReschedulePayload {
  new_start_date: string; 
  new_end_date: string;   
}

export interface Promo {
  id: string;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  min_booking_amount: number;
  max_discount: number;
  status: string;
}

export interface IBookingVehicle {
  id: string;
  vehicle_id: string;
  booking_id: string;
  vehicle: IVehicle
}

export interface Payment {
  id: string;
  booking_id: string;
  status: string;
  amount: string;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  total_amount: number;
  expiry_date: string;
  created_at?:string;
}

export interface RequestRefundPayload {
  reason: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
}

export interface UnavailableDatesPayload {
  vehicleIds: string[];
  excludeBookingId: string;
}

export interface RefundResponse {
  id: string;
  booking_id: string;
  user_id: string;
  payment_id?: string | null;
  refund_amount: string | number; 
  request_date: string;     
  approval_date?: string | null;
  processed_by?: string | null;
  bank_name: string;
  account_holder: string;
  account_number: string;
  status: RefundStatus;
  reason: string;
  admin_notes?: string | null;
  refund_method?: string | null;
  transfer_proof?: string | null;
  created_at: string;     
  updated_at: string;     
  deleted_at?: string | null;
}

export type BookingStatus =
  | "SUBMITTED"
  | "PAYMENT_PENDING"
  | "RECEIVED"
  | "COMPLETE"
  | "CANCELED"
  | "CONFIRMED"
  | "REJECTED_BOOKING"
  | "REJECTED_REFUND"
  | "REJECTED_RESHEDULE"
  | "RESCHEDULE_REQUESTED"
  | "RESCHEDULED"
  | "REFUND_REQUESTED"
  | "REFUNDED";

  export type RefundStatus =
  | "PENDING"
  | "APPROVED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELED_BY_USER";
