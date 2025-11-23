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
  if (u >= 0.95) return "text-emerald-600";
  if (u >= 0.8) return "text-amber-500";
  return "text-red-500";
}

export default function MachineCard({ m }: { m: Machine }) {
  return (
    <div className="rounded-2xl bg-white p-4 border shadow-sm min-h-[220px] flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs text-slate-400">Line · {m.id}</div>
            <div className="text-lg font-semibold text-slate-800">{m.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Uptime</div>
            <div className={`font-semibold ${uptimeColor(m.uptimePct)}`}>
              {(m.uptimePct * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500 mb-2">
          Last active:{" "}
          <span className="text-slate-700">{m.lastActive ? new Date(m.lastActive).toLocaleString() : "-"}</span>
        </div>

        <div className="mb-3">
          <Sparkline data={m.series} height={84} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-3 py-2 text-sm rounded-lg border bg-white">Telemetry</button>
        <button className="px-3 py-2 text-sm rounded-lg border bg-white">Logs</button>
        <button className="ml-auto px-4 py-2 text-sm rounded-lg bg-amber-400 text-slate-900 font-medium shadow">
          Acknowledge
        </button>
      </div>
    </div>
  );
}
