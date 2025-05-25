import { HttpError } from "./http-error";

export async function httpRequest<T>(
  url: string,
  options?: RequestInit,
  accessToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "include",
      headers,
      ...options,
    });
  } catch (error: any) {
    throw new HttpError(error.message || "Network error", 0);
  }

  let text: string;
  let result: any;
  try {
    text = await res.text();
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new HttpError("Invalid JSON response", res.status);
  }

  if (!res.ok) {
    throw new HttpError(result?.message || "Request failed", res.status);
  }

  return result as T;
}
