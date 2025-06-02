import type { IAccomodation } from "../../acccomodation/types/accomodation.type";

export interface ITravelPack {
  travel_itineraries: any;
  accommodation_id?: string
  accomodation: IAccomodation
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
  travel_itineraries: ITravel_Itineraries[]
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

export interface ITravel_Itineraries {
  id?: string;
  destination_id: string;
  day_number: number;
  description: string
}

export interface AddNewItinerariesDto {
  travel_package_id: string;
  newItineraries: ITravel_Itineraries[];
}

export interface AddNewPax {
   travel_package_id: string;
   new_pax_options: TravelPax[]
}

export interface AddNewDest {
    travel_package_id: string;
    new_travel_destination: ITravelPackageDestination[]
}

export interface UpdateTravelPackDto {
  description: string;
  duration: number;
  name: string;
  image: string;
  pax_options: TravelPax[];
  travel_package_destinations: ITravelPackageDestination[];
}
