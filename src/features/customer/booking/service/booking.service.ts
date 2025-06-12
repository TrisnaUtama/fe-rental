import { httpRequest } from "@/shared/utils/http-client";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type {
  BookingResponse,
  CreateBookingPayload,
  RefundResponse,
  RequestRefundPayload,
  RequestReschedulePayload,
  RescheduleRequestResponse,
  SearchPayload,
  UnavailableDatesPayload,
  UnavailableDatesResponse,
  UpdateBookingPayload,
} from "../types/booking.type";
import type { IVehicle } from "@/features/admin/protected/vehicle/types/vehicle.type";

export async function CreateBooking(
  payload: CreateBookingPayload,
  token: string
): Promise<IResponseGlobal<BookingResponse>> {
  return await httpRequest<IResponseGlobal<BookingResponse>>(
    `${import.meta.env.VITE_API_KEY}bookings/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllBooking(
  token: string
): Promise<IResponseGlobal<BookingResponse[]>> {
  return await httpRequest<IResponseGlobal<BookingResponse[]>>(
    `${import.meta.env.VITE_API_KEY}bookings/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function GetUnavailableDatesForMultipleVehicles(
  payload: UnavailableDatesPayload,
  token: string
): Promise<IResponseGlobal<string[]>> {
  return await httpRequest<IResponseGlobal<string[]>>(
    `${import.meta.env.VITE_API_KEY}bookings/unavailable-dates-for-vehicles`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllAvailableVehicle(
  payload: SearchPayload
): Promise<IResponseGlobal<IVehicle[]>> {
  return await httpRequest<IResponseGlobal<IVehicle[]>>(
    `${import.meta.env.VITE_API_KEY}bookings/available-cars`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );
}

export async function GetUnavailableDatesForVehicles(
  vehicleIds: string[]
): Promise<IResponseGlobal<UnavailableDatesResponse>> {
  const idsString = vehicleIds.join(',');
  const url = `${import.meta.env.VITE_API_KEY}bookings/available-vehicles?vehicleIds=${idsString}`;

  return await httpRequest<IResponseGlobal<UnavailableDatesResponse>>(
    url,
    {
      method: "GET",
      credentials: "include", 
    }
  );
}


export async function FindBookingById(
  id: string,
  token: string
): Promise<IResponseGlobal<BookingResponse>> {
  return await httpRequest<IResponseGlobal<BookingResponse>>(
    `${import.meta.env.VITE_API_KEY}bookings/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function GetUserBooking(
  token: string
): Promise<IResponseGlobal<BookingResponse[]>> {
  return await httpRequest<IResponseGlobal<BookingResponse[]>>(
    `${import.meta.env.VITE_API_KEY}bookings/user`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateBooking(
  id: string,
  payload: UpdateBookingPayload,
  token: string
): Promise<IResponseGlobal<BookingResponse>> {
  return await httpRequest<IResponseGlobal<BookingResponse>>(
    `${import.meta.env.VITE_API_KEY}bookings/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteBooking(
  id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}bookings/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}

export async function RequestReschedule(
  bookingId: string,
  payload: RequestReschedulePayload,
  token: string
): Promise<IResponseGlobal<RescheduleRequestResponse>> {
  return await httpRequest<IResponseGlobal<RescheduleRequestResponse>>(
    `${import.meta.env.VITE_API_KEY}bookings/${bookingId}/reschedule`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function RequestRefund(
  bookingId: string,
  payload: RequestRefundPayload,
  token: string
): Promise<IResponseGlobal<RefundResponse>> {
  return await httpRequest<IResponseGlobal<RefundResponse>>(
    `${import.meta.env.VITE_API_KEY}bookings/${bookingId}/refund-request`,
    {
      method: "POST", 
      body: JSON.stringify(payload), 
      credentials: "include",
    },
    token
  );
}
