import Cookies from "js-cookie";
import { refreshAccessToken } from "@/features/auth/services/auth.service";

let contextUpdateAccessToken: (token: string) => void;
let contextLogout: () => void;
export const setupApi = (
  updateAccessToken: (token: string) => void,
  logout: () => void
) => {
  contextUpdateAccessToken = updateAccessToken;
  contextLogout = logout;
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token); 
    }
  });
  failedQueue = [];
};
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = Cookies.get("access_token");
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  options.headers = headers;
  let response = await fetch(url, options);
  if (response.status !== 401) {
    return response;
  }
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((newToken) => {
      headers.set("Authorization", `Bearer ${newToken}`);
      options.headers = headers;
      return fetch(url, options);
    });
  }

  isRefreshing = true;

  try {
    const result = await refreshAccessToken();
    const newAccessToken = result.access_token;
    if (contextUpdateAccessToken) {
        contextUpdateAccessToken(newAccessToken);
    }
    processQueue(null, newAccessToken);
    headers.set("Authorization", `Bearer ${newAccessToken}`);
    options.headers = headers;
    return fetch(url, options);

  } catch (error) {
    processQueue(error, null);
    if (contextLogout) {
        contextLogout();
    }
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}