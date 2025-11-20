import React from "react";

export default function ModuleCard({ title, bullets, cta }: { title: string; bullets: string[]; cta?: { label?: string; href?: string } }) {
  return (
    <div className="p-5 rounded-2xl shadow-md bg-gradient-to-br from-white/60 to-white/30 border border-slate-100 hover:scale-[1.01] transition">
      <h4 className="font-semibold mb-2 text-slate-800">{title}</h4>

      <ul className="text-sm text-slate-600 mb-4 space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>

      <a href={cta?.href || "#"} className="inline-flex items-center text-sky-600 font-medium">
        {cta?.label || "Explore"}
      </a>
    </div>
  );
}
