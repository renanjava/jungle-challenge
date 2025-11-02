import React, { createContext, useState, useContext, useEffect } from "react";
import { websocketService } from "@/services/websocketService";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setTokens: (access: string, refresh: string) => void;
  setAccess: (access: string) => void;
  clearTokens: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const decodeToken = (token: string): User | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    return {
      id: payload.sub || payload.id || payload.user_id,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (accessToken) {
      websocketService.connect(accessToken);
    } else {
      websocketService.disconnect();
    }
  }, [accessToken]);

  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = getCookie("refreshToken");

    if (storedAccess && storedRefresh) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);

      const userData = decodeToken(storedAccess);
      setUser(userData);
    }
  }, []);

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    setCookie("refreshToken", refresh, 7);

    const userData = decodeToken(access);
    setUser(userData);
  };

  const setAccess = (access: string) => {
    setAccessToken(access);
    localStorage.setItem("accessToken", access);

    const userData = decodeToken(access);
    setUser(userData);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    deleteCookie("refreshToken");
    websocketService.disconnect();
  };

  const value: AuthContextType = {
    accessToken,
    refreshToken,
    user,
    setTokens,
    setAccess,
    clearTokens,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
