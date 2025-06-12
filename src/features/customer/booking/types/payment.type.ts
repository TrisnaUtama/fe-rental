

export interface IPaymentSnap {
  token: string;
  payment_id: string;
}

export interface IPayment {
  id: string;
  booking_id: string;
  status: string;
  amount: string;
  payment_method: string;
  payment_status: string;
  payment_date: string;
  total_amount: number;
  expiry_date: string;
}