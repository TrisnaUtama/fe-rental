import {jwtDecode} from "jwt-decode";

export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000;
  } catch (e) {
    return null;
  }
}

export function getTokenRemaining(token: string): {
  remainingSeconds: number;
  remainingMinutes: number;
  remainingString: string;
} {
  const expiry = getTokenExpiry(token);
  const now = Date.now();
  const diff = expiry! - now;

  const remainingSeconds = Math.floor(diff / 1000);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingString =
    remainingSeconds <= 0
      ? "Expired"
      : `${remainingMinutes}m ${remainingSeconds % 60}s remaining`;

  return { remainingSeconds, remainingMinutes, remainingString };
}
