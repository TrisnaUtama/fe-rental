import { httpRequest } from "@/shared/utils/http-client";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type { IUpdateImage, IUploadImage } from "../types/storage.type";

export async function UploadImage(
  payload: File,
  token: string
): Promise<IResponseGlobal<IUploadImage>> {
  const formData = new FormData();
  formData.append("file", payload);
  return await httpRequest<IResponseGlobal<IUploadImage>>(
    `${import.meta.env.VITE_API_KEY}storages/upload`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
    token,
    "multipart/form-data"
  );
}

export async function UpdateImage(
  payload: IUpdateImage,
  token: string
): Promise<IResponseGlobal<IUpdateImage>> {
  const formData = new FormData();
  if ("file" in payload && payload.file instanceof File) {
    formData.append("file", payload.file);
  }
  if ("prevImage" in payload) {
    formData.append("oldFilename", payload.oldFilename);
  }
  return await httpRequest<IResponseGlobal<IUpdateImage>>(
    `${import.meta.env.VITE_API_KEY}storages/update`,
    {
      method: "PATCH",
      body: formData,
      credentials: "include",
    },
    token,
    "multipart/form-data"
  );
}

export async function DeleteImage(
  filename: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}storages/${filename}`,
    {
      method: "DELETE",
      credentials: "include",
    },
    token
  );
}
