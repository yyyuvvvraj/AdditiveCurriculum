// src/components/Providers.tsx
"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
  // SessionProvider must be outside any useSession() callers (AuthProvider uses useSession)
  return (
    <SessionProvider session={session}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
