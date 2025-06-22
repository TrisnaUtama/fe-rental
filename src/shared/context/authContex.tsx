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

  const cookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax" as "Lax", 
    path: "/",
  };

  const login = useCallback((user: User, accessToken: string) => {
    setUser(user);
    Cookies.set("user", JSON.stringify(user), { ...cookieOptions, expires: 7 });
    Cookies.set("access_token", accessToken, cookieOptions);

    setAccessToken(accessToken);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    setUser(null);
    setAccessToken(null);
  }, []);

  const updateAccessToken = useCallback((token: string) => {
    Cookies.set("access_token", token, cookieOptions);
    setAccessToken(token);
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedUser };
      Cookies.set("user", JSON.stringify(newUser), { ...cookieOptions, expires: 7 });
      return newUser;
    });
  }, []);

  useEffect(() => {
    const rawUser = Cookies.get("user");
    if (!rawUser) {
        setIsLoading(false);
        logout();
        return;
    }

    const tryRefresh = async () => {
      try {
        const result = await refreshAccessToken();
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
        updateAccessToken(result.access_token);
      } catch (err) {
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
        return; 
      }
      if (remainingSeconds < 90) {
        try {
          const currentToken = Cookies.get("access_token");
          if(accessToken === currentToken) {
            const result = await refreshAccessToken();
            updateAccessToken(result.access_token);
          }
        } catch (err: any) {
          logout();
        }
      }
    }, 30 * 1000); 

    return () => clearInterval(interval);
  }, [accessToken, updateAccessToken, logout]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateAccessToken,
      accessToken,
      updateUser,
      setUser,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, login, logout, updateAccessToken, updateUser, accessToken, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}