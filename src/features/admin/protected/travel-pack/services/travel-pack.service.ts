import { httpRequest } from "@/shared/utils/http-client";
import type { AddNewDest, AddNewItinerariesDto, AddNewPax, ICreateTravelPack, ITravelPack, UpdateTravelPackDto } from "../types/travel-pack";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function CreateTravelPack(
  payload: ICreateTravelPack,
  token: string
): Promise<IResponseGlobal<ITravelPack>> {
  return await httpRequest<IResponseGlobal<ITravelPack>>(
    `${import.meta.env.VITE_API_KEY}travel/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllTravelPack(
  token: string
): Promise<IResponseGlobal<ITravelPack[]>> {
  return await httpRequest<IResponseGlobal<ITravelPack[]>>(
    `${import.meta.env.VITE_API_KEY}travel/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function FindTravelPackById(
  id: string,
  token: string
): Promise<IResponseGlobal<ITravelPack>> {
  return await httpRequest<IResponseGlobal<ITravelPack>>(
    `${import.meta.env.VITE_API_KEY}travel/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateTravelPack(
  id: string,
  payload: UpdateTravelPackDto,
  token: string
): Promise<IResponseGlobal<UpdateTravelPackDto>> {
  return await httpRequest<IResponseGlobal<UpdateTravelPackDto>>(
    `${import.meta.env.VITE_API_KEY}travel/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function addNewItineraries(
  payload: AddNewItinerariesDto,
  token: string
): Promise<IResponseGlobal<any>> {
  return await httpRequest<IResponseGlobal<any>>(
    `${import.meta.env.VITE_API_KEY}travel/itineraries`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function addNewPax(
  payload: AddNewPax,
  token: string
): Promise<IResponseGlobal<any>> {
  return await httpRequest<IResponseGlobal<any>>(
    `${import.meta.env.VITE_API_KEY}travel/pax`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}
export async function addNewDestination(
  payload: AddNewDest,
  token: string
): Promise<IResponseGlobal<any>> {
  return await httpRequest<IResponseGlobal<any>>(
    `${import.meta.env.VITE_API_KEY}travel/destination`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteTravelPack(
  id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}travel/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}
