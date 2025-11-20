// src/components/RequireAuth.tsx
"use client";
import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // redirect to login and include original path as callback
      const redirectTo = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
      router.replace(`/login?callbackUrl=${encodeURIComponent(redirectTo)}`);
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse p-6 rounded-xl bg-white/80 shadow">Checking authentication…</div>
      </div>
    );
  }

  // when authenticated, render children
  return <>{children}</>;
}
