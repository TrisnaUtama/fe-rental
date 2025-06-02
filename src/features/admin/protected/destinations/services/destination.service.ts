import { httpRequest } from "@/shared/utils/http-client";
import type {
  ICreateDestination,
  IDestination,
} from "../types/destination.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function CreateDestination(
  payload: ICreateDestination,
  token: string
): Promise<IResponseGlobal<IDestination>> {
  return await httpRequest<IResponseGlobal<IDestination>>(
    `${import.meta.env.VITE_API_KEY}destinations/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllDestination(
  token: string
): Promise<IResponseGlobal<IDestination[]>> {
  return await httpRequest<IResponseGlobal<IDestination[]>>(
    `${import.meta.env.VITE_API_KEY}destinations/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function FindDestinationById(
  id: string,
  token: string
): Promise<IResponseGlobal<IDestination>> {
  return await httpRequest<IResponseGlobal<IDestination>>(
    `${import.meta.env.VITE_API_KEY}destinations/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateDestination(
  id: string,
  payload: IDestination,
  token: string
): Promise<IResponseGlobal<IDestination>> {
  return await httpRequest<IResponseGlobal<IDestination>>(
    `${import.meta.env.VITE_API_KEY}destinations/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteDestination(
  id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}destinations/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}
