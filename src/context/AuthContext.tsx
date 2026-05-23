import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  login as apiLogin,
  logout as apiLogout,
} from "../services/zillinieApi";

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  sessionToken?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (username: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const AUTH_STORAGE_KEY = "zillinie-auth-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      if (user.sessionToken) {
        api.defaults.headers.common["x-session-token"] = user.sessionToken;
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      delete api.defaults.headers.common["x-session-token"];
    }
  }, [user]);

  const signIn = async (username: string, password: string) => {
    const authUser = await apiLogin(username, password);
    // if server issued a session token, set it on axios defaults
    if ((authUser as any).sessionToken) {
      api.defaults.headers.common["x-session-token"] = (
        authUser as any
      ).sessionToken;
    }
    setUser(authUser);
    return authUser;
  };

  const signOut = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore errors
    }
    // remove session token header
    delete api.defaults.headers.common["x-session-token"];
    setUser(null);
  };

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
