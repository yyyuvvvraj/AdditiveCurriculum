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
    
    // Only check for token if NOT on landing page
    // This prevents "flashing" the dashboard header on the home page
    if (pathname !== "/") {
        const token = localStorage.getItem("token");
        if (token) setIsDemoAuthenticated(true);
    }
  }, [pathname]);

  if (!mounted) return null;

  // LOGIC: Show TopNav ONLY if logged in AND NOT on home page
  const isLoggedIn = session || isDemoAuthenticated;
  const showDashboardNav = isLoggedIn && pathname !== "/";

  if (showDashboardNav) {
    return <TopNav />;
  }

  // --- PUBLIC HEADER (Landing Page View) ---
  return (
    <header className="site-header fixed top-0 w-full z-50 transition-all">
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

        {/* RIGHT: LOGIN BUTTON */}
        <div className="flex items-center gap-4">
            <Link href="/login" className="btn primary">
              <svg className="w-4 h-4 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              Login to Console
            </Link>
        </div>

      </div>
    </header>
  );
}