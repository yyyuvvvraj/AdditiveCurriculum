import React from "react";

export default function ModuleCard({ title, bullets, cta }: { title: string; bullets: string[]; cta?: { label?: string; href?: string } }) {
  return (
    <div className="card p-5 hover:scale-[1.01] transition">
      <h4 className="font-semibold mb-2">{title}</h4>

      <ul className="text-sm muted mb-4 space-y-1">
        {bullets.map((b, i) => (
          <li key={i}>• {b}</li>
        ))}
      </ul>

      <a href={cta?.href || "#"} style={{ color: 'var(--primary)', fontWeight: 600 }} className="inline-flex items-center">
        {cta?.label || "Explore"}
      </a>
    </div>
  );
}
