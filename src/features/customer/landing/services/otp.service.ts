import { httpRequest } from "@/shared/utils/http-client";
import type { IOtp, IVerifiedAccount,  } from "../types/otp.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function VerifiedAccount(payload:IVerifiedAccount): Promise<IOtp> {
  const data =  await httpRequest<IResponseGlobal<IOtp>>(`${import.meta.env.VITE_API_KEY}verify`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.data
}

export async function GetOtp(user_id:string): Promise<IOtp> {
  const data =  await httpRequest<IResponseGlobal<IOtp>>(`${import.meta.env.VITE_API_KEY}`, {
    method: "POST",
    body: JSON.stringify({user_id}),
  });
  return data.data
}

export async function ResendOtp(id:string, email:string): Promise<IOtp>{
  const data =  await httpRequest<IResponseGlobal<IOtp>>(`${import.meta.env.VITE_API_KEY}resend-otp`, {
    method: "POST",
    body: JSON.stringify({id, email}),
  });
  return data.data
}
