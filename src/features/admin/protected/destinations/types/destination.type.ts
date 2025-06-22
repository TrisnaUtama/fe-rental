import type { ITravelPackageDestination } from "../../travel-pack/types/travel-pack";

export interface IDestination {
  id: string;
  name: string;
  open_hour: string;
  description: string;
  image_urls: string[];
  address: string
  category: string,
  facilities: string[];
  status?: boolean;
  deleted_at?: Date | null;
  travel_package_destinations?: ITravelPackageDestination[]
}

export interface ICreateDestination {
  name: string;
  open_hour: string;
  description: string;
  image_urls: string[];
  address: string;
  facilities: string[];
  status?: boolean;
  deleted_at?: Date | null;
}