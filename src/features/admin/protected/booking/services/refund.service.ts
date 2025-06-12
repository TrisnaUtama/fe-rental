import { httpRequest } from "@/shared/utils/http-client";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type { 
  RefundResponse,
  ApproveRefundPayload, 
  RejectRefundPayload 
} from "../types/booking.type"; 
const API_BASE_URL = `${import.meta.env.VITE_API_KEY}refunds`;

export async function GetAllRefunds(
  token: string
): Promise<IResponseGlobal<RefundResponse[]>> {
  return await httpRequest<IResponseGlobal<RefundResponse[]>>(
    API_BASE_URL,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function GetRefundById(
  refundId: string,
  token: string
): Promise<IResponseGlobal<RefundResponse>> {
  return await httpRequest<IResponseGlobal<RefundResponse>>(
    `${API_BASE_URL}/${refundId}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function ApproveRefund(
  refundId: string,
  payload: ApproveRefundPayload,
  token: string
): Promise<IResponseGlobal<RefundResponse>> {
  return await httpRequest<IResponseGlobal<RefundResponse>>(
    `${API_BASE_URL}/${refundId}/approve`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function RejectRefund(
  refundId: string,
  payload: RejectRefundPayload,
  token: string
): Promise<IResponseGlobal<RefundResponse>> {
  return await httpRequest<IResponseGlobal<RefundResponse>>(
    `${import.meta.env.VITE_API_KEY}refunds/${refundId}/reject`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}