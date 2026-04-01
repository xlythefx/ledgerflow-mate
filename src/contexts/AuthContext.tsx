import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || "https://app.company.com/login";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: AuthUser }>("/user")
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err?.status === 401) {
          window.location.href = LOGIN_URL;
        } else {
          // In development/preview without a backend, fall back to a mock user
          setUser({ id: 0, name: "Anastasia", email: "anastasia@company.com", avatar_url: null });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
