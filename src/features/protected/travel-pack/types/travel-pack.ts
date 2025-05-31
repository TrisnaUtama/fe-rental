export interface ITravelPack {
  id: string;
  image: string;
  name: string;
  duration: number;
  description: string;
  status: boolean;
  pax_options: TravelPax[];
  travel_package_destinations: ITravelPackageDestination[];
  deleted_at?: Date | null;
}

export interface ICreateTravelPack {
  name: string;
  image: string;
  duration: number;
  description: string;
  pax_options: TravelPax[];
  travel_package_destinations: {
    destination_id: string;
  }[];
  deleted_at?: Date | null;
}

export interface TravelPax {
  id?: string
  pax: number;
  price: number;
}

export interface ITravelPackageDestination {
  id?: string;
  travel_package_id?: string;
  destination_id: string;
  deleted_at?: string;
}

export interface UpdateTravelPackDto {
  description: string;
  duration: number;
  name: string;
  image: string;
  pax_options: TravelPax[];
  travel_package_destinations: ITravelPackageDestination[];
}
