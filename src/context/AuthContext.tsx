// src/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type User = { id?: string; name?: string | null; email?: string | null; image?: string | null; role?: string | null } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const user = useMemo<User>(() => {
    if (!session?.user) return null;
    return {
      id: (session as any)?.user?.id ?? undefined,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
      role: (session as any)?.user?.role ?? null,
    };
  }, [session]);

  async function login(provider = "google") {
    await signIn(provider, { callbackUrl: "/dashboard" });
  }

  async function logout() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
