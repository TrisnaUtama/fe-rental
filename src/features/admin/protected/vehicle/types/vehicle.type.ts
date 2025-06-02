
export interface IVehicle {
  id: string;
  name: string;
  type: string;
  transmition: string;
  status: string;
  fuel: string;
  brand: string;
  capacity: number;
  kilometer: number;
  year: number;
  price_per_day: string;
  image_url: string[];
  description: string;
  color: string;
  deleted_at?: string | null;
}

export interface ICreateVehicle {
  name: string;
  type: string;
  transmition: string;
  status: string;
  fuel: string;
  brand: string;
  capacity: number;
  kilometer: number;
  year: number;
  price_per_day: string;
  image_url: string[];
  description: string;
  color: string;
  deleted_at?: string | null;
}
