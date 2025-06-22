import { httpRequest } from "@/shared/utils/http-client"; 
import type { IResponseGlobal } from "@/shared/types/standard-response"; 
import type { ICreateRatingPayload, IRating, IUpdateRatingPayload } from "../types/rating.type";

export async function CreateRating(
  payload: ICreateRatingPayload,
  token: string
): Promise<IResponseGlobal<IRating>> {
  return await httpRequest<IResponseGlobal<IRating>>(
    `${import.meta.env.VITE_API_KEY}rating/`,
    {
      method: "POST",
      body: JSON.stringify({ ...payload, status: true }), 
      credentials: "include",
    },
    token
  );
}

export async function GetAllRating(
): Promise<IResponseGlobal<IRating[]>> {
  return await httpRequest<IResponseGlobal<IRating[]>>(
    `${import.meta.env.VITE_API_KEY}rating/`,
    {
      method: "GET",
      credentials: "include",
    },
  );
}

export async function GetRatingById(
  id: string,
  token: string
): Promise<IResponseGlobal<IRating>> {
  return await httpRequest<IResponseGlobal<IRating>>(
    `${import.meta.env.VITE_API_KEY}rating/${id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function GetRatingByTargetId(
  targetId: string,
  token: string
): Promise<IResponseGlobal<IRating[]>> {
  return await httpRequest<IResponseGlobal<IRating[]>>(
    `${import.meta.env.VITE_API_KEY}rating/target/${targetId}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateRating(
  id: string,
  payload: IUpdateRatingPayload,
  token: string
): Promise<IResponseGlobal<IRating>> {
  return await httpRequest<IResponseGlobal<IRating>>(
    `${import.meta.env.VITE_API_KEY}rating/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteRating(
  id: string,
  token: string
): Promise<IResponseGlobal<void>> { 
  return await httpRequest<IResponseGlobal<void>>(
    `${import.meta.env.VITE_API_KEY}rating/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}