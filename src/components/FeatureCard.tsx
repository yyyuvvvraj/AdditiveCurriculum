import React from "react";

export default function FeatureCard({ title, desc, icon, hint }: { title: string; desc: string; icon?: React.ReactNode; hint?: string }) {
  return (
    <div className="p-5 rounded-2xl shadow-lg bg-gradient-to-br from-white to-white/50 border border-slate-100 hover:-translate-y-1 transition">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center text-2xl shadow">{icon}</div>
        <div>
          <h4 className="font-semibold text-slate-800">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{desc}</p>
          {hint && <div className="mt-2 text-xs text-slate-400">{hint}</div>}
        </div>
      </div>
    </div>
  );
}
