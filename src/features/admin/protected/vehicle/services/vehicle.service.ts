import { httpRequest } from "@/shared/utils/http-client";
import type { ICreateVehicle, IVehicle } from "../types/vehicle.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function CreateVehicle(
  payload: ICreateVehicle,
  token: string
): Promise<IResponseGlobal<IVehicle>> {
  return await httpRequest<IResponseGlobal<IVehicle>>(
    `${import.meta.env.VITE_API_KEY}vehicles/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllVehicle(
  token: string
): Promise<IResponseGlobal<IVehicle[]>> {
  return await httpRequest<IResponseGlobal<IVehicle[]>>(
    `${import.meta.env.VITE_API_KEY}vehicles/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function FindVehicleById(
  id: string,
  token: string
): Promise<IResponseGlobal<IVehicle>> {
  return await httpRequest<IResponseGlobal<IVehicle>>(
    `${import.meta.env.VITE_API_KEY}vehicles/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateVehicle(
  id: string,
  payload: IVehicle,
  token: string
): Promise<IResponseGlobal<IVehicle>> {
  return await httpRequest<IResponseGlobal<IVehicle>>(
    `${import.meta.env.VITE_API_KEY}vehicles/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteVehicle(
  id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}vehicles/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}
