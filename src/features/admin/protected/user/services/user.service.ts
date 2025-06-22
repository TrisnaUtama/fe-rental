import { httpRequest } from "@/shared/utils/http-client";
import type { ICreateUser, IUploadResult, IUser } from "../types/user.type";
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
  payload: ICreateUser,
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

export async function UploadUsersFromFile(
  file: File,
  token: string
): Promise<IResponseGlobal<IUploadResult[]>> {
  const formData = new FormData();
  formData.append("file", file);
  return await httpRequest<IResponseGlobal<IUploadResult[]>>(
    `${import.meta.env.VITE_API_KEY}users/upload`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
    token,
    "multipart/form-data"
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
