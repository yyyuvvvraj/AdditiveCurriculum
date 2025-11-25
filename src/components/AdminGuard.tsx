// src/components/AdminGuard.tsx
"use client";
import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "admin@vb.com",
  "yuvraj280605@gmail.com", // your Google login
];

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const user = (session as any)?.user;
      const role = user?.role;
      const email: string | undefined = user?.email;

      const isAdmin =
        role === "admin" ||
        (email && ADMIN_EMAILS.includes(email));

      if (!isAdmin) {
        // logged in but not admin -> send to dashboard
        router.replace("/dashboard");
      }
    } else if (status === "unauthenticated") {
      // not logged in -> go to login
      router.replace("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="card p-6">Checking admin access…</div>
      </div>
    );
  }

  return <>{children}</>;
}
