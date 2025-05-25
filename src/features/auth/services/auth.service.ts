import { httpRequest } from "@/shared/utils/http-client";
import type { IUser, ISignUpPayload, IAuthResponse } from "../types/auth.type";
import type { IResponseGlobal } from "@/shared/types/standard-response";

export async function SignIn(
  email: string,
  password: string
): Promise<IAuthResponse> {
  return await httpRequest<IAuthResponse>(
    `${import.meta.env.VITE_API_KEY}sign-in`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }
  );
}

export async function SignUp(
  payload: ISignUpPayload
): Promise<IResponseGlobal<IUser>> {
  return await httpRequest<IResponseGlobal<IUser>>(
    `${import.meta.env.VITE_API_KEY}sign-up`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function SignOut(
  user_id: string,
  token: string
): Promise<IResponseGlobal<string>> {
  return await httpRequest<IResponseGlobal<string>>(
    `${import.meta.env.VITE_API_KEY}users/sign-out/${user_id}`,
    {
      method: "PATCH",
    },
    token
  );
}

export async function refreshAccessToken(): Promise<{access_token: string}> {
  return await httpRequest<{ access_token: string }>(
    `${import.meta.env.VITE_API_KEY}refresh`,
    {
      method: "POST",
      credentials: "include", 
    }
  );
}
