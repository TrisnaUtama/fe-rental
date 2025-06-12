import { httpRequest } from "@/shared/utils/http-client";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type { IPayment, IPaymentSnap } from "../types/payment.type";

export async function GetAllPayment(
  token: string
): Promise<IResponseGlobal<IPayment[]>> {
  return await httpRequest<IResponseGlobal<IPayment[]>>(
    `${import.meta.env.VITE_API_KEY}payments/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function FindPaymentById(
  id: string,
  token: string
): Promise<IResponseGlobal<IPayment>> {
  return await httpRequest<IResponseGlobal<IPayment>>(
    `${import.meta.env.VITE_API_KEY}payments/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UserPaying(
  id: string,
  token: string
): Promise<IResponseGlobal<IPaymentSnap>> {
  return await httpRequest<IResponseGlobal<IPaymentSnap>>(
    `${import.meta.env.VITE_API_KEY}payments/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      // body: JSON.stringify({payment_method})
    },
    token
  );
}
