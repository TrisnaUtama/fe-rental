// http-client/httpRequest.ts
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
      result = await res.blob(); // Fallback for other content types
    }
  } catch (parseError) {
    // If res.json() fails, it means the body wasn't valid JSON.
    // Try to read it as plain text to get *something*.
    let rawText = '';
    try {
        rawText = await res.text(); // Attempt to read as text if JSON parsing fails
    } catch (textError) {
        // Can't even read as text, very unusual
    }
    console.error("Failed to parse response body as JSON.", parseError, "Raw response text:", rawText);
    throw new HttpError(
      `Invalid response format or malformed JSON. Raw: ${rawText.substring(0, 100)}...`, // Include raw text for debugging
      res.status
    );
  }

  if (!res.ok) {
    let errorMessage = "Request failed";
    let validationErrors: Record<string, string[]> | undefined;

    // Standardize error message and extract validation errors
    if (typeof result === "object") {
        // Elysia's default validation error structure
        if (result.errors && Array.isArray(result.errors)) {
            errorMessage = "Validation Error";
            validationErrors = {};
            result.errors.forEach((err: any) => {
                const path = err.path ? err.path.replace('/body/', '') : 'general'; // Remove '/body/' prefix
                if (path) {
                    if (!validationErrors![path]) {
                        validationErrors![path] = [];
                    }
                    validationErrors![path].push(err.message || 'Invalid value');
                }
            });
        } else if (result.message) {
            // Your StandardResponse.error format
            errorMessage = result.message;
            if (result.errors) { // If StandardResponse.error includes an 'errors' field
                validationErrors = result.errors;
            }
        }
        // Fallback if result is an object but doesn't fit known error structures
        // You might log `result` directly here for debugging
        console.error("Unknown error object structure:", result);
    } else if (typeof result === 'string' && result.length > 0) {
        errorMessage = result; // If the response was a plain error string
    }

    throw new HttpError(errorMessage, res.status, validationErrors);
  }

  return result as T;
}