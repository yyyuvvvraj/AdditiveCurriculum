// src/components/TopNav.tsx
"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ADMIN_EMAILS = [
  "admin@vb.com",
  "yuvraj280605@gmail.com", // you
];

export default function TopNav() {
  // keep this try/catch pattern you were using
  let authSafe: { user: any; logout: () => void } = { user: null, logout: () => {} };
  try {
    authSafe = useAuth();
  } catch (e) {
    // not mounted yet
  }

  const { user, logout } = authSafe;
  const router = useRouter();

  const isAdmin =
    user?.role === "admin" ||
    (user?.email && ADMIN_EMAILS.includes(user.email));

  return (
    <header className="px-6 py-3 flex items-center justify-between bg-gradient-to-r from-cyan-600 to-indigo-700 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center font-bold">
          VB
        </div>
        <div>
          <div className="font-bold">Vasus Brakes</div>
          <div className="text-xs opacity-80">Monitoring Suite</div>
        </div>
      </div>

      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/inventory" className="hover:underline">
          Inventory
        </Link>
        <Link href="/machines" className="hover:underline">
          Machines
        </Link>
        <Link href="/consumption" className="hover:underline">
          Consumption
        </Link>
        <Link href="/alerts" className="hover:underline">
          Alerts
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="ml-2 px-3 py-1 rounded bg-amber-400 text-slate-900 text-sm hover:bg-amber-300"
          >
            Admin
          </Link>
        )}

        <div className="ml-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
            {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </div>
          <div className="text-sm">
            {user?.name || user?.email || "Guest"}
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-white/10 px-3 py-1 rounded"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
