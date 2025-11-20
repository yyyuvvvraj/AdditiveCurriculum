// src/components/Header.tsx
"use client";
import React from "react";
import { useSession } from "next-auth/react";
import TopNav from "./TopNav";

/**
 * Header:
 * - Shows the public landing header (Sign In CTA) when no session
 * - If the user is authenticated, render TopNav instead (prevents duplicate bars)
 */
export default function Header() {
  const { data: session, status } = useSession();

  // while loading prefer to render the public header (avoids flicker)
  if (status === "loading" || !session) {
    return (
      <header className="backdrop-blur-md sticky top-0 z-40 shadow-md bg-gradient-to-r from-sky-600/80 via-cyan-600/80 to-indigo-700/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-lg shadow-lg">VB</div>
            <div>
              <h1 className="text-lg font-bold text-white">Vasus Brakes</h1>
              <p className="text-xs text-sky-100/80">Real-time Monitoring Suite</p>
            </div>
          </div>

          <div>
            <button onClick={() => window.location.href = "/login"} className="inline-flex items-center bg-white text-slate-900 px-4 py-2 rounded-lg shadow hover:scale-[1.02] transition">Sign In</button>
          </div>
        </div>
      </header>
    );
  }

  // user is authenticated -> show TopNav (so there is only one top bar)
  return <TopNav />;
}
