import { HttpError } from "./http-error";

export async function httpRequest<T>(
  url: string,
  options?: RequestInit,
  accessToken?: string,
  content_type: string = "application/json"
): Promise<T> {
  const headers: Record<string, string> = {
    ...((options?.headers as Record<string, string>) || {}),
  };

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

  const contentType = res.headers.get("content-type") || "";
  let result: any;

  try {
    if (contentType.includes("application/json") || !res.ok) {
      result = await res.json();
    } else if (contentType.startsWith("text/")) {
      result = await res.text();
    } else {
      result = await res.blob();
    }
  } catch (parseError) {
    let rawText = '';
    try {
        rawText = await res.text(); 
    } catch (textError) {
    }
    throw new HttpError(
      `Invalid response format or malformed JSON. Raw: ${rawText.substring(0, 100)}...`,
      res.status
    );
  }

  if (!res.ok) {
    let errorMessage = "Request failed";
    let validationErrors: Record<string, string[]> | undefined;

    if (typeof result === "object") {
        if (result.errors && Array.isArray(result.errors)) {
            errorMessage = "Validation Error";
            validationErrors = {};
            result.errors.forEach((err: any) => {
                const path = err.path ? err.path.replace('/body/', '') : 'general'; 
                if (path) {
                    if (!validationErrors![path]) {
                        validationErrors![path] = [];
                    }
                    validationErrors![path].push(err.message || 'Invalid value');
                }
            });
        } else if (result.message) {
            errorMessage = result.message;
            if (result.errors) { 
                validationErrors = result.errors;
            }
        }
    } else if (typeof result === 'string' && result.length > 0) {
        errorMessage = result; 
    }

    throw new HttpError(errorMessage, res.status, validationErrors);
  }

  return result as T;
}