// src/components/MachineCard.tsx
"use client";
import React from "react";
import Sparkline, { Point } from "@/components/charts/Sparkline";

export type Machine = {
  id: string;
  name: string;
  uptimePct: number; // 0..1
  status: "Running" | "Warning" | "Stopped";
  lastActive?: string; // ISO date string
  series: Point[];
};

function uptimeColor(u: number) {
  if (u >= 0.95) return "var(--success)";
  if (u >= 0.8) return "var(--warning)";
  return "var(--danger)";
}

export default function MachineCard({ m }: { m: Machine }) {
  return (
    <div className="card p-4 min-h-[220px] flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs muted">Line · {m.id}</div>
            <div className="text-lg font-semibold">{m.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs muted">Uptime</div>
            <div className={`font-semibold`} style={{ color: uptimeColor(m.uptimePct) }}>
              {(m.uptimePct * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="text-sm muted mb-2">
          Last active: {" "}
          <span style={{ color: 'var(--text)' }}>{m.lastActive ? new Date(m.lastActive).toLocaleString() : "-"}</span>
        </div>

        <div className="mb-3">
          <Sparkline data={m.series} height={84} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn ghost px-3 py-2 text-sm">Telemetry</button>
        <button className="btn ghost px-3 py-2 text-sm">Logs</button>
        <button className="ml-auto btn" style={{ background: 'var(--warning)', color: '#0b1220', fontWeight: 700 }}>
          Acknowledge
        </button>
      </div>
    </div>
  );
}
