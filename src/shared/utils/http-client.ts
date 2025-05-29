import { HttpError } from "./http-error";

export async function httpRequest<T>(
  url: string,
  options?: RequestInit,
  accessToken?: string,
  content_type: string = "application/json"
): Promise<T> {
  // Compose headers, conditionally set Content-Type
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };

  // For multipart/form-data, the browser sets the boundary automatically
  if (content_type !== "multipart/form-data") {
    headers["Content-Type"] = content_type;
  }

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

  // Extract content-type header from response
  const contentType = res.headers.get("content-type") || "";

  let result: any;

  try {
    // Parse response based on content type
    if (contentType.includes("application/json")) {
      result = await res.json();
    } else if (contentType.startsWith("text/")) {
      result = await res.text();
    } else if (contentType.includes("multipart/form-data")) {
      result = await res.blob();
    } else {
      result = await res.blob();
    }
  } catch (parseError) {
    throw new HttpError("Invalid response format", res.status);
  }

  if (!res.ok) {
    const errorMessage =
      typeof result === "object" && result?.message
        ? result.message
        : "Request failed";
    throw new HttpError(errorMessage, res.status);
  }

  return result as T;
}
