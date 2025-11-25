// src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginClient() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const authError = searchParams.get("error");

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: pw,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: pw, name }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not register");
      setLoading(false);
      return;
    }

    // after successful register, sign in automatically
    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password: pw,
      callbackUrl,
    });

    setLoading(false);

    if (signInRes?.error) {
      setError("Registered but login failed. Try signing in manually.");
      return;
    }

    router.push(callbackUrl);
  }

  function handleGoogle() {
    signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      
      {/* LEFT SIDE: BRANDING & VISUALS */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 p-12 text-white relative overflow-hidden border-r border-slate-800">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
        
        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <span className="font-black text-lg text-white">VB</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Vasus Brakes</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                Intelligent Manufacturing Control.
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
                Monitor critical spare parts, track real-time machine telemetry, and optimize your supply chain with our AI-driven dashboard.
            </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-500">
            © 2025 Vasus Brakes India Pvt Ltd. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
        
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-extrabold text-slate-100">
                    {mode === "signin" ? "Welcome back" : "Get started"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    {mode === "signin" 
                        ? "Enter your credentials to access the control tower." 
                        : "Create a new account to start monitoring."}
                </p>
            </div>

            {/* Error Message */}
            {(error || authError) && (
                <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-300">
                            {error || (authError === "OAuthCallback" 
                                ? "Google sign-in failed. Please clear cookies and try again or use email/password login."
                                : "Authentication error. Please try again.")}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-700 rounded-xl text-slate-300 font-medium hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-[0.98]"
                >
                    <FcGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                    <div className="relative bg-slate-900 px-4 text-xs text-slate-500 uppercase font-bold tracking-wider">Or continue with email</div>
                </div>

                <form onSubmit={mode === "signin" ? handleEmailSignIn : handleRegister} className="space-y-5">
                    
                    {mode === "signup" && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all" 
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all" 
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1 ml-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase">Password</label>
                            {mode === "signin" && (
                                <button type="button" onClick={() => router.push("/forgot-password")} className="text-xs font-medium text-cyan-400 hover:text-cyan-300">Forgot password?</button>
                            )}
                        </div>
                        <input 
                            type="password" 
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all" 
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            mode === "signin" ? "Sign In to Dashboard" : "Create Account"
                        )}
                    </button>
                </form>
            </div>

            {/* Toggle Mode */}
            <div className="text-center">
                <p className="text-sm text-slate-400">
                    {mode === "signin" ? "Don't have an account yet?" : "Already have an account?"}{" "}
                    <button 
                        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                        className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        {mode === "signin" ? "Sign up" : "Log in"}
                    </button>
                </p>
            </div>

            {/* Demo Helper */}
            {mode === "signin" && (
                <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-300 mb-2">Testing the app?</p>
                    <button 
                        onClick={() => { setEmail("test@test.com"); setPw("test"); }}
                        className="text-xs font-bold bg-slate-800 border border-amber-700 px-3 py-1.5 rounded-md text-amber-400 hover:bg-slate-700 transition-colors"
                    >
                        Auto-fill Demo Credentials
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}