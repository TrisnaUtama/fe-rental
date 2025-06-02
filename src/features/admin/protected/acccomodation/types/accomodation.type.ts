export interface IAccomodation {
  id: string;
  name: string;
  address: string;
  description?: string;
  image_urls: string[];
  price_per_night: number;
  facilities: string[]
  status: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface ICreateAccomodation {
  name: string;
  address: string;
  description?: string;
  image_urls: string[];
  price_per_night: number;
  status: boolean;
  facilities: string[]
}