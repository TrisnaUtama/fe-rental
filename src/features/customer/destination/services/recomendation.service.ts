import { httpRequest } from "@/shared/utils/http-client";
import type { IResponseGlobal } from "@/shared/types/standard-response";
import type { IDestination } from "@/features/admin/protected/destinations/types/destination.type";


export async function GetRecomendation(
  token: string,
  user_id: string
): Promise<IResponseGlobal<IDestination[]>> {
  return await httpRequest<IResponseGlobal<IDestination[]>>(
    `${import.meta.env.VITE_API_KEY}recommendations/`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({user_id})
    },
    token
  );
}
