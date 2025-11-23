// src/components/Header.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopNav from "./TopNav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) setIsDemoAuthenticated(true);
  }, []);

  if (!mounted) return null;

  // --- AUTH STATE ---
  const isLoggedIn = session || isDemoAuthenticated;
  const isLandingPage = pathname === "/";

  // --- CASE 1: APP NAVIGATION ---
  // Only show the complex dashboard menu if:
  // 1. User is Logged In
  // 2. User is NOT on the Landing Page
  if (isLoggedIn && !isLandingPage) {
    return <TopNav />;
  }

  // --- CASE 2: PUBLIC HEADER (Landing Page Style) ---
  // Matches the clean white aesthetic you requested.
  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LEFT: BRANDING */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:bg-indigo-600 transition-colors">
            VB
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
              Vasus Brakes
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Control Tower
            </span>
          </div>
        </Link>

        {/* RIGHT: ACTION BUTTON */}
        <div className="flex items-center gap-4">
            {isLoggedIn ? (
                // If user is already logged in, give them a shortcut back to the app
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold rounded-full transition-all hover:shadow-md active:scale-95"
                >
                  <span>Open Dashboard</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            ) : (
                // If user is logged out, show Login button
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold rounded-full shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                  Login to Console
                </Link>
            )}
        </div>

      </div>
    </header>
  );
}