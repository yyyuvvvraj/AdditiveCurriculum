// src/app/not-found.tsx
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-md w-full px-6 py-8 card rounded-2xl shadow-lg border border-slate-700/50 text-center">
        <div className="text-5xl mb-2">🧭</div>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Page not found
        </h1>
        <p className="text-sm text-slate-400 mb-5">
          The page you’re looking for doesn’t exist. Choose where to go next:
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg btn btn-primary text-sm font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-slate-600 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            Back to landing page
          </Link>
        </div>
      </div>
    </div>
  );
}
