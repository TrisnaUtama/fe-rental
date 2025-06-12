export interface IOtp {
  id: string;
  user_id: string;
  otp_code: string;
  expiry_time: string;
}

export interface IVerifiedAccount {
  user_id:string
  code: string
}
