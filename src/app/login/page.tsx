"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", { redirect: false, email, password: pw });
      if ((res as any)?.error) {
        setError((res as any).error || "Invalid credentials");
        setLoading(false);
        return;
      }
      setLoading(false);
      // navigate to callbackUrl if present
      const params = new URLSearchParams(window.location.search);
      const cb = params.get("callbackUrl") ?? "/dashboard";
      router.push(cb);
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await login("google");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-sky-700 to-indigo-800 rounded-2xl p-6 shadow-2xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center font-extrabold">VB</div>
            <div>
              <div className="text-lg font-bold">Vasus Brakes</div>
              <div className="text-xs opacity-80">Monitoring Suite — Sign in</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-xl p-4 text-slate-800">
            <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
            <p className="text-sm text-slate-500 mb-4">Sign in to view dashboards, alerts and inventory controls.</p>

            <button
              type="button"
              onClick={handleGoogle}
              className="mb-4 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-white text-slate-800"
            >
              <FcGoogle className="w-5 h-5" /> Sign in with Google
            </button>

            <div className="flex items-center justify-center text-xs text-slate-400 mb-3">or use your company credentials</div>

            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border mb-3"
              placeholder="you@company.com"
              required
            />

            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border mb-4"
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <input id="remember" type="checkbox" className="h-4 w-4" />
                <label htmlFor="remember" className="text-slate-500">Remember me</label>
              </div>
              <button type="button" className="text-sm text-amber-500">Forgot?</button>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 rounded-lg bg-amber-400 text-slate-900 font-medium shadow">
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => { setEmail("operator@vb.com"); setPw("demo"); }}
                className="px-3 py-2 rounded-lg border text-sm"
                title="Fill demo"
              >
                Demo
              </button>
            </div>
          </form>

          <div className="mt-4 text-xs text-white/80 text-center">By signing in you agree to the company usage policy.</div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500">
          Need access? <a href="#contact" className="text-amber-500 font-medium">Request trial</a>
        </div>
      </div>
    </div>
  );
}
