// src/app/forgot-password/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- ICONS ---
const MailIcon = () => <svg className="w-12 h-12 text-indigo-100 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2" className="fill-indigo-600 stroke-indigo-600" /><path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const CheckIcon = () => <svg className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-in zoom-in duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const ArrowLeftIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  function validateEmail(v: string) {
    return /^\S+@\S+\.\S+$/.test(v);
  }

  async function submitEmail(e?: React.FormEvent) {
    if (e) e.preventDefault();
    
    if (!validateEmail(email.trim())) {
      setMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    
    setMessage(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setMessage(payload?.message || `Server error (${res.status})`);
        setStatus("error");
        return;
      }

      setStatus("sent");
      setMessage(null); // Clear error message on success
    } catch (err: any) {
      console.error(err);
      setMessage("Network connection failed. Please try again.");
      setStatus("error");
    }
  }

  // --- SUCCESS STATE VIEW ---
  if (status === "sent") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-500 mb-6">
            We sent a password reset link to <br/>
            <span className="font-bold text-slate-800">{email}</span>
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.open('mailto:', '_blank')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all"
            >
              Open Email App
            </button>
            <button 
              onClick={() => { setStatus("idle"); setEmail(""); }}
              className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Try another email
            </button>
          </div>
          
          <div className="mt-6 text-xs text-slate-400">
            Did not receive the email? Check your spam filter.
          </div>
        </div>
      </div>
    );
  }

  // --- FORM STATE VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 relative z-10 overflow-hidden">
        
        <div className="px-8 py-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-indigo-100">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
            <p className="text-slate-500 mt-2 text-sm">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={submitEmail} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="Enter your email"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Sending Link...
                </>
              ) : "Reset Password"}
            </button>

            {message && (
              <div className={`p-3 rounded-lg text-sm font-medium flex items-start gap-2 ${status === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {message}
              </div>
            )}
          </form>
        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 group"
          >
            <ArrowLeftIcon />
            <span>Back to log in</span>
          </Link>
        </div>

      </div>
    </div>
  );
}