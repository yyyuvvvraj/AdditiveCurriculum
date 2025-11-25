import React from "react";

export default function FeatureCard({ title, desc, icon, hint }: { title: string; desc: string; icon?: React.ReactNode; hint?: string }) {
  return (
    <div className="card p-5 hover:-translate-y-1 transition">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(180deg,var(--primary),var(--primary-600))', color: 'white' }}>{icon}</div>
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm muted mt-1">{desc}</p>
          {hint && <div className="mt-2 text-xs muted">{hint}</div>}
        </div>
      </div>
    </div>
  );
}
