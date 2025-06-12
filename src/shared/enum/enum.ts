// Roles
export type Roles =
  | "SUPERADMIN"
  | "ADMIN_OPERATIONAL"
  | "ADMIN_FINANCE"
  | "DRIVER"
  | "CUSTOMER";

// Notification Types
export type NotificationType = "PROMO" | "REMINDER";

// Vehicle Status
export type VehicleStatus = "RENTED" | "MAINTENANCE" | "AVAILABLE" | "DISABLE";

// Transmission
export type Transmission = "MANUAL" | "AUTOMATIC";

// Vehicle Types
export type VehicleTypes =
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

// Fuel Types
export type Fuel =
  | "PERTALITE"
  | "PERTAMAX"
  | "DEXLITE"
  | "PERTAMAXTURBO";

// Booking Status
export type BookingStatus =
  | "SUBMITTED"
  | "PAYMENT_PENDING"
  | "RECEIVED"
  | "COMPLETE"
  | "CANCELED"
  | "REJECTED_BOOKING"
  | "REJECTED_REFUND"
  | "REJECTED_RESHEDULE" 
  | "RESCHEDULE_REQUESTED"
  | "RESCHEDULED"
  | "REFUND_REQUESTED"
  | "REFUNDED"
  | "CONFIRMED";

// Promo Status
export type PromoStatus = "ACTIVE" | "EXPIRED" | "UNACTIVE" | "CANCELED";

// Payment Method
export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "QRIS"
  | "EWALLET"
  | "CREDIT_CARD";

// Payment Status
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

// Discount Type
export type DiscountType = "PERCENTAGE" | "FIXED";

// Travel Status
export type TravelStatus =
  | "WAITING_FOR_CUSTOMER"
  | "ON_THE_WAY"
  | "ARRIVED_AT_DESTINATION"
  | "ONGOING_TRIP"
  | "COMPLETED"
  | "CANCELED";
