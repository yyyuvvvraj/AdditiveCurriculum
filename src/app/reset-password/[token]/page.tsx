"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ResetPasswordPage() {
  const params = useParams() as { token?: string };
  const router = useRouter();
  const urlToken = params?.token ?? "";

  const [token, setToken] = useState(urlToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // if token arrives after render, keep it
    if (urlToken && urlToken !== token) setToken(urlToken);
  }, [urlToken]);

  function passwordValid(pw: string) {
    return pw.length >= 8;
  }

  function passwordsMatch() {
    return password === confirm;
  }

  function passwordStrengthLabel(pw: string) {
    if (!pw) return "Too short";
    if (pw.length < 8) return "Very weak";
    const score =
      (/[A-Z]/.test(pw) ? 1 : 0) +
      (/[0-9]/.test(pw) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
    if (pw.length >= 12 && score >= 2) return "Strong";
    if (pw.length >= 10 && score >= 1) return "Good";
    return "Weak";
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setMessage(null);

    if (!token) {
      setMessage(
        "Missing reset token. Paste the token from the email or follow the link."
      );
      setStatus("error");
      return;
    }

    if (!passwordValid(password)) {
      setMessage("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }

    if (!passwordsMatch()) {
      setMessage("Passwords do not match.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage("Password reset successful — redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
        return;
      } else {
        setStatus("error");
        setMessage(data.message || `Failed to reset password (${res.status})`);
      }
    } catch (err: any) {
      console.error("reset error", err);
      setStatus("error");
      setMessage("Network or server error. Try again later.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-slate-900">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* FORM */}
        <div className="card rounded-xl p-8 shadow-md border border-slate-700/50">
          <h1 className="text-2xl font-bold text-slate-100">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Set a new password for your account. The link you received is
            single-use and expires automatically.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Reset token
            </label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
              placeholder="Paste token from email (or use link)"
              aria-label="reset token"
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mt-2">
                New password
              </label>
              <div className="relative mt-2">
                <input
                  type={visible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                  placeholder="Minimum 8 characters"
                  aria-label="new password"
                />
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className="absolute right-2 top-2 h-8 px-2 rounded text-sm bg-slate-700 border border-slate-600 text-slate-200 hover:bg-slate-600"
                  aria-pressed={visible}
                >
                  {visible ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <div>
                  Password strength:{" "}
                  <span className="font-medium text-slate-300">
                    {passwordStrengthLabel(password)}
                  </span>
                </div>
                <div>{password.length} chars</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mt-2">
                Confirm password
              </label>
              <input
                type={visible ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                placeholder="Repeat the new password"
                aria-label="confirm password"
              />
            </div>

            <div className="flex gap-3 items-center mt-4">
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-slate-900 font-medium shadow-md transition
                  ${
                    status === "submitting"
                      ? "bg-cyan-600/90"
                      : "bg-cyan-500 hover:bg-cyan-400"
                  }`}
              >
                {status === "submitting" ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Saving…
                  </>
                ) : (
                  "Save new password"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPassword("");
                  setConfirm("");
                }}
                className="px-3 py-2 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800 text-sm"
              >
                Clear
              </button>
            </div>

            {status === "error" && message && (
              <div className="mt-3 text-sm rounded-md px-3 py-2 bg-red-950/50 text-red-300 border border-red-800">
                {message}
              </div>
            )}

            {status === "success" && message && (
              <div className="mt-3 text-sm rounded-md px-3 py-2 bg-emerald-950/50 text-emerald-300 border border-emerald-800">
                {message}
              </div>
            )}
          </form>

          <div className="mt-6 text-xs text-slate-400">
            <div>
              If the token is invalid or expired, request a new reset link from
              the sign-in page.
            </div>
            <div className="mt-2">
              <a href="/login" className="text-cyan-400 hover:text-cyan-300">
                Back to sign in
              </a>
            </div>
          </div>
        </div>

        {/* PREVIEW / HELP */}
        <aside className="flex flex-col gap-4 items-center justify-start">
          <div className="w-full rounded-xl card shadow-lg border border-slate-700/50 p-4">
            <img
              src="/dashboard-preview.png"
              alt="Dashboard preview"
              className="w-full max-h-80 object-contain"
            />
          </div>

          <div className="w-full card rounded-xl p-4 text-sm text-slate-400 border border-slate-700/50">
            <div className="font-semibold mb-2 text-slate-200">Reset link info</div>
            The reset link you received contains a one-time token. If clicking
            the link opened this page, the token is already populated. You can
            also paste the token manually.
          </div>
        </aside>
      </div>
    </div>
  );
}
