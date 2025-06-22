import { httpRequest } from "@/shared/utils/http-client";
import type {
  IPromo,
  CreatePromo, UpdatePromo
} from "../types/promo.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function CreatePromo(
  payload: CreatePromo,
  token: string
): Promise<IResponseGlobal<IPromo>> {
  return await httpRequest<IResponseGlobal<IPromo>>(
    `${import.meta.env.VITE_API_KEY}promo/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function UpdatePromo(
  id: string,
  payload: UpdatePromo,
  token: string
): Promise<IResponseGlobal<IPromo>> {
  return await httpRequest<IResponseGlobal<IPromo>>(
    `${import.meta.env.VITE_API_KEY}promo/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllPromo(
  token: string
): Promise<IResponseGlobal<IPromo[]>> {
  return await httpRequest<IResponseGlobal<IPromo[]>>(
    `${import.meta.env.VITE_API_KEY}promo/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function GetOnePromo(
  id: string,
  token: string
): Promise<IResponseGlobal<IPromo>> {
  return await httpRequest<IResponseGlobal<IPromo>>(
    `${import.meta.env.VITE_API_KEY}promo/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function DeletePromo(
  id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}promo/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}

