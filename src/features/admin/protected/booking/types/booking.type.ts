import type {
  IBookingVehicle,
  Payment,
  Promo,
  RescheduleStatus,
} from "@/features/customer/booking/types/booking.type";
import type {
  ITravelPack,
  TravelPax,
} from "../../travel-pack/types/travel-pack";
import type { IVehicle } from "../../vehicle/types/vehicle.type";
import type { IUser } from "@/features/auth/types/auth.type";

export interface BookingResponse {
  id: string;
  user_id: string;
  promo_id?: string | null;
  travel_package_id?: string | null;
  pax_option?: TravelPax;
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
  RescheduleRequests?: RescheduleRequestResponse[];
  Refunds?: RefundResponse[];
  users?: IUser;
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

export interface AssignVehiclePayload {
  vehicle_ids: string[];
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

export interface ApproveRefundPayload {
  admin_notes?: string;
  transfer_proof: string; 
}

export interface RejectRefundPayload {
  admin_notes: string; 
}

export interface RescheduleRequestResponse {
  id: string;
  booking_id: string;
  new_start_date: string;
  new_end_date: string;  
  status: RescheduleStatus;
  created_at?: string;    
  updated_at?: string;    
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
  | "CANCEL";