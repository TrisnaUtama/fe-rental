import { useState } from "react";
import type { IOtp, IVerifiedAccount } from "../types/otp.type";
import { VerifiedAccount, GetOtp, ResendOtp } from "../services/otp.service";

type OtpStatus = "idle" | "loading" | "success" | "error";

export function useOtp() {
  const [otp, setOtp] = useState<IOtp | null>(null);
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleVerified(payload: IVerifiedAccount) {
    setStatus("loading");
    try {
      const data = await VerifiedAccount(payload);
      setStatus("success");
      setError(null);
      return data;
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Unknown error");
      throw err;
    }
  }
  
  async function handleGetOtp(id:string){
    try{
      const data = await GetOtp(id);
      setOtp(data)
      setError(null);
      return data;
    }catch(err : any){
      setStatus("error");
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  async function handleResendOtp(id:string, email:string){
    try{
      const data = await ResendOtp(id, email);
      setOtp(data)
      setError(null);
      return data;
    }catch(err:any){
      setStatus("error");
      setError(err.message || "Unknown error");
      throw err;
    }
  }

  return {
    otp,
    status,
    error,
    verified: handleVerified,
    getOtp: handleGetOtp,
    resendOtp: handleResendOtp
  };


}

