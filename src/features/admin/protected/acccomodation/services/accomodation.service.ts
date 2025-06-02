import { httpRequest } from "@/shared/utils/http-client";
import type {
  ICreateAccomodation,
  IAccomodation,
} from "../types/accomodation.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function CreateAccomodation(
  payload: ICreateAccomodation,
  token: string
): Promise<IResponseGlobal<IAccomodation>> {
  return await httpRequest<IResponseGlobal<IAccomodation>>(
    `${import.meta.env.VITE_API_KEY}accomodation/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllAccomodation(
  token: string
): Promise<IResponseGlobal<IAccomodation[]>> {
  return await httpRequest<IResponseGlobal<IAccomodation[]>>(
    `${import.meta.env.VITE_API_KEY}accomodation/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function FindAccomodationById(
  id: string,
  token: string
): Promise<IResponseGlobal<IAccomodation>> {
  return await httpRequest<IResponseGlobal<IAccomodation>>(
    `${import.meta.env.VITE_API_KEY}accomodation/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateAccomodation(
  id: string,
  payload: IAccomodation,
  token: string
): Promise<IResponseGlobal<IAccomodation>> {
  return await httpRequest<IResponseGlobal<IAccomodation>>(
    `${import.meta.env.VITE_API_KEY}accomodation/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteAccomodation(
  id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}accomodation/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}
