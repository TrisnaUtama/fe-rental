import { httpRequest } from "@/shared/utils/http-client";

import type { IResponseGlobal } from "@/shared/types/standard-response";
import type { AssignVehiclePayload, BookingResponse, UpdateBookingPayload } from "../types/booking.type";

export async function GetAllBookings(
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

export async function GetFullyBookedDatesForVehicles(
  vehicleIds: string[]
): Promise<IResponseGlobal<string[]>> { 
  const idsString = vehicleIds.join(',');
  const url = `${import.meta.env.VITE_API_KEY}bookings/fully-booked-dates?vehicleIds=${idsString}`;
  return await httpRequest<IResponseGlobal<string[]>>(
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

export async function assignVehicleAndConfirmBooking(
  id: string,
  payload: AssignVehiclePayload,
  token: string
): Promise<IResponseGlobal<BookingResponse>> {
  return await httpRequest<IResponseGlobal<BookingResponse>>(
    `${import.meta.env.VITE_API_KEY}bookings/assign-vehicle/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

