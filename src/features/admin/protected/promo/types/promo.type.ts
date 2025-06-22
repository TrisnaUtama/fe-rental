export interface IPromo {
  id: string;
  code: string;
  description: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  min_booking_amount: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePromo {
  code: string;
  description: string;
  discount_value: number;
  start_date: string; 
  end_date: string;   
  min_booking_amount: string;    
  status?: boolean; 
}

export interface UpdatePromo {
  code?: string;
  description?: string;
  discount_value?: number;
  start_date?: string;
  end_date?: string;
  min_booking_amount?: string;
  status?: boolean;
}
