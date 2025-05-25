import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import type { AuthContextType, User } from "@/features/auth/types/auth.type";
import { refreshAccessToken } from "@/features/auth/services/auth.service";
import { getTokenRemaining } from "../utils/jwt";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => Cookies.get("access_token") || null
  );

  const login = useCallback((user: User, accessToken: string) => {
    setUser(user);
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });
    Cookies.set("access_token", accessToken, {
      expires: 7,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });
    setAccessToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    setUser(null);
    setAccessToken(null);
  }, []);

  const updateAccessToken = useCallback((token: string) => {
    Cookies.set("access_token", token, {
      expires: 7,
      secure: true,
      sameSite: "Lax",
      path: "/",
    });
    setAccessToken(token);
  }, []);

  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const result = await refreshAccessToken();
        const rawUser = Cookies.get("user");
        const parsedUser = rawUser ? JSON.parse(rawUser) : null;

        if (parsedUser) {
          setUser(parsedUser);
          updateAccessToken(result.access_token);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Failed to refresh session", err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    tryRefresh();
  }, [logout, updateAccessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const interval = setInterval(async () => {
      const { remainingSeconds } = getTokenRemaining(accessToken);
      if (remainingSeconds <= 0) {
        logout();
        clearInterval(interval);
        return;
      }
      if (remainingSeconds < 60) {
        try {
          const result = await refreshAccessToken();
          updateAccessToken(result.access_token);
        } catch (err: any) {
          logout();
          throw new Error(err.message);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [accessToken, updateAccessToken, logout]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateAccessToken,
      accessToken,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, login, logout, updateAccessToken, accessToken, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
