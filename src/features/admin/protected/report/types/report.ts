export type RescheduleStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Roles =
  | "SUPERADMIN"
  | "ADMIN_OPERATIONAL"
  | "ADMIN_FINANCE"
  | "DRIVER"
  | "CUSTOMER";

export type Notification_Type = "PROMO" | "REMINDER";

export type Vehicle_status = "RENTED" | "MAINTENANCE" | "AVAILABLE" | "DISABLE";

export type Transmission = "MANUAL" | "AUTOMATIC";

export type RatedEntityType = "DESTINATION" | "VEHICLE" | "PACKAGE"; 

export type Vehicle_Types =
  | "CITY_CAR"
  | "HATCHBACK"
  | "SEDAN"
  | "SUV"
  | "MPV"
  | "MINIVAN"
  | "PICKUP"
  | "DOUBLE_CABIN"
  | "LUXURY"
  | "ELECTRIC_CAR";

export type Fuel = "PERTALITE" | "PERTAMAX" | "DEXLITE" | "PERTAMAXTURBO";

export type Promo_Status = "ACTIVE" | "EXPIRED" | "UNACTIVE" | "CANCELED";

export type Payment_Method =
  | "CASH"
  | "BANK_TRANSFER"
  | "QRIS"
  | "EWALLET"
  | "CREDIT_CARD";

  export interface DateRange {
    from: Date | null;
    to: Date | null;
  }

export type Payment_Status = "PENDING" | "PAID" | "FAILED" | "CANCELED" | "EXPIRED";

export type Booking_Status =
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

export type Refund_Status =
  | "PENDING"
  | "APPROVED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELED_BY_USER";

export type Travel_Status =
  | "WAITING_FOR_CUSTOMER"
  | "ON_THE_WAY"
  | "ARRIVED_AT_DESTINATION"
  | "ONGOING_TRIP"
  | "COMPLETED"
  | "CANCELED";

// --- Models (Interfaces) ---

export interface OTPs {
  id: string;
  user_id: string;
  otp_code: string;
  expiry_time: string; 
  created_at: string; 
}



export interface Users {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  password?: string;
  is_verified?: boolean;
  status: boolean;
  role?: Roles; 
  year_of_experiences?: number;
  created_at: string; 
  updated_at?: string; 
  deleted_at?: string; 
  refresh_token?: string;
}

export interface Notifications {
  id: string;
  title: string;
  message: string;
  type: Notification_Type; 
  status: boolean;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Notification_Broadcast {
  id: string;
  notification_id: string;
  user_id: string;
  status: boolean;
  read_at?: string; 
  sent_at?: string; 
}

export interface Accommodations {
  id: string;
  name: string;
  address: string;
  description?: string;
  image_urls: string[];
  price_per_night: number;
  facilities: string[];
  status: boolean;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Travel_Itineraries {
  id: string;
  travel_package_id: string;
  day_number: number;
  destination_id: string;
  description?: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Vehicles {
  id: string;
  name: string;
  type: Vehicle_Types;
  transmition: Transmission; 
  status: Vehicle_status; 
  fuel: Fuel; 
  brand: string;
  capacity: number;
  kilometer: number;
  year: number;
  price_per_day: number;
  image_url: string[];
  description: string;
  color: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Booking_Vehicles {
  id: string;
  booking_id: string;
  vehicle_id: string;
  vehicle: Vehicles; 
}

export interface Destinations {
  id: string;
  name: string;
  open_hour: string;
  description: string;
  image_urls: string[];
  address: string;
  category: string;
  facilities: string[];
  status: boolean;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Travel_Packages_Destinations {
  id: string;
  travel_package_id: string;
  destination_id: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
  destination: Destinations; 
}

export interface Travel_Packages_Pax {
  id: string;
  travel_package_id: string;
  pax: number;
  price: number;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Travel_Packages {
  id: string;
  name: string;
  duration: number;
  description: string;
  status: boolean;
  accommodation_id?: string;
  image: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 

  accommodation?: Accommodations; 
  travel_itineraries?: Travel_Itineraries[];
  pax_options?: Travel_Packages_Pax[]; 
  travel_package_destinations?: Travel_Packages_Destinations[]; 
}

export interface Promos {
  id: string;
  code: string;
  description: string;
  discount_value: number; 
  start_date: string; 
  end_date: string; 
  min_booking_amount: number;
  status: boolean;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Payments {
  id: string;
  booking_id: string;
  payment_method: string;
  payment_status: Payment_Status; 
  payment_date?: string; 
  total_amount: number;
  expiry_date?: string; 
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface RescheduleRequest {
  id: string;
  booking_id: string;
  new_start_date: string; 
  new_end_date: string; 
  status: RescheduleStatus; // Uses the union type
  created_at: string; 
  updated_at: string; 
}

export interface Refunds {
  id: string;
  booking_id: string;
  user_id: string;
  payment_id?: string;
  refund_amount: number; 
  request_date: string; 
  approval_date?: string; 
  processed_by?: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
  status: Refund_Status;
  reason: string;
  admin_notes?: string;
  refund_method?: string;
  transfer_proof?: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export interface Bookings {
  id: string;
  user_id: string;
  promo_id?: string;
  travel_package_id?: string;
  status: Booking_Status; 
  start_date: string; 
  pax_option_id?: string;
  end_date?: string; 
  total_price?: number;
  card_id: string;
  licences_id: string;
  pick_up_at_airport: boolean;
  notes?: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 

  booking_vehicles: (Booking_Vehicles & { vehicle: Vehicles })[]; 
  travel_package?: (Travel_Packages & {
    travel_package_destinations?: (Travel_Packages_Destinations & { destination: Destinations })[];
  });
  Payments: Payments[];
  promos?: Promos;
  users: Users; 
  pax_option?: Travel_Packages_Pax;
  Refunds: Refunds[];
  RescheduleRequests: RescheduleRequest[];
}


export interface Rating {
  id: string;
  userId: string;
  ratedType: RatedEntityType;
  targetId: string;
  ratingValue: number;
  status: boolean;
  comment: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}


export interface IOverallBusinessSummary {
  totalBookings: number;
  confirmedBookings: number;
  canceledBookings: number;
  totalRevenue: number;
  totalRefunds: number;
  netRevenue: number;
}

export interface IFinancialSummary {
  totalPaidAmount: number;
  totalRefundedAmount: number;
  netRevenue: number;
  paymentsByMethod: { [key: string]: number };
  promoImpact: { [key: string]: { totalDiscount: number; usageCount: number } };
}

export type IRatingReportItem = Rating;

export interface IAverageRatingData {
  totalRating: number;
  count: number;
  average: number;
}

export type IAverageRatingsPerEntity = {
  [key in RatedEntityType]?: IAverageRatingData;
};


export type IBookingReportItem = Bookings;

export interface IRescheduleRequestReportItem extends RescheduleRequest {
    booking: Pick<Bookings, 'id' | 'start_date' | 'end_date' | 'status'>;
}

export interface IVehicleUtilizationReport {
  [vehicleId: string]: {
    name: string;
    bookingCount: number;
    totalBookedDays: number;
  };
}

export interface ITravelPackagePopularityReport {
  [packageId: string]: { 
    name: string;
    bookingCount: number;
    totalRevenue: number;
  };
}

export type IUserReportItem = Users;

export interface IPaymentReportItem extends Payments {
    bookingId: string;
    userId: string;
}

export interface IRefundReportItem extends Refunds {
    bookingId: string;
    userId: string;
}

export interface IPromoUsageReport {
  [promoId: string]: {
    code: string;
    usageCount: number;
    totalDiscountValue: number;
  };
}

export interface IDailyBusinessSummaryItem {
  date: string; 
  totalBookings: number;
  confirmedBookings: number;
  canceledBookings: number;
  totalRevenue: number; 
  totalRefunds: number; 
  netRevenue: number; 
}