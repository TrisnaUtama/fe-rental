import { httpRequest } from "@/shared/utils/http-client";
import type { ICreateUser, IUser } from "../types/user.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function CreateUser(
  payload: ICreateUser,
  token: string
): Promise<IResponseGlobal<IUser>> {
  return await httpRequest<IResponseGlobal<IUser>>(
    `${import.meta.env.VITE_API_KEY}users/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function GetAllUsers(
  token: string
): Promise<IResponseGlobal<IUser[]>> {
  return await httpRequest<IResponseGlobal<IUser[]>>(
    `${import.meta.env.VITE_API_KEY}users/`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function FindUserById(
  user_id: string,
  token: string
): Promise<IResponseGlobal<IUser>> {
  return await httpRequest<IResponseGlobal<IUser>>(
    `${import.meta.env.VITE_API_KEY}users/${user_id}`,
    {
      method: "GET",
      credentials: "include",
    },
    token
  );
}

export async function UpdateUser(
  user_id: string,
  payload: IUser,
  token: string
): Promise<IResponseGlobal<IUser>> {
  return await httpRequest<IResponseGlobal<IUser>>(
    `${import.meta.env.VITE_API_KEY}users/${user_id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      credentials: "include",
    },
    token
  );
}

export async function DeleteUser(
  user_id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}users/${user_id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}
