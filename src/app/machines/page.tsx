// src/app/machines/page.tsx
"use client";
import React from "react";
import RequireAuth from "@/components/RequireAuth";
import ModuleCard from "@/components/ModuleCard";

type Machine = {
  id: string;
  name: string;
  line: string;
  uptime: number; // percent
  status: "Running" | "Warning" | "Stopped";
  lastFault?: string;
};

const machines: Machine[] = [
  { id: "M-101", name: "Press #1", line: "Line 1", uptime: 98, status: "Running", lastFault: "-" },
  { id: "M-202", name: "Cutter #2", line: "Line 2", uptime: 92, status: "Warning", lastFault: "Overheat (2h ago)" },
  { id: "M-303", name: "Assembler #3", line: "Line 3", uptime: 88, status: "Stopped", lastFault: "Motor fault (ack)" },
];

function UptimePill({ val }: { val: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-br from-white to-white/40 shadow-inner">
      <div className="text-xs text-slate-500">Uptime</div>
      <div className={`font-semibold ${val >= 90 ? "text-green-700" : val >= 70 ? "text-amber-600" : "text-red-500"}`}>{val}%</div>
    </div>
  );
}

function MachinesContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Machines</h1>
            <div className="text-sm text-slate-500">Real-time machine health & recent faults</div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-white/80 text-slate-800 border shadow">Refresh</button>
            <button className="px-4 py-2 rounded-lg bg-amber-400 text-slate-900">Add Machine</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {machines.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-4 border shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-slate-500">{m.line} • {m.id}</div>
                  <div className="font-semibold text-lg text-slate-800">{m.name}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <UptimePill val={m.uptime} />
                  <div className={`text-sm font-medium ${m.status === "Running" ? "text-green-600" : m.status === "Stopped" ? "text-red-500" : "text-amber-500"}`}>{m.status}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600">Last fault: <span className="text-slate-500">{m.lastFault}</span></div>

              <div className="mt-4 h-20 rounded-md bg-gradient-to-b from-white/60 to-white/30 p-3">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke={m.uptime >= 90 ? "#10b981" : m.uptime >= 75 ? "#f59e0b" : "#ef4444"}
                    strokeWidth={2}
                    points={m.id === "M-101" ? "0,20 20,15 40,10 60,12 80,8 100,10" : m.id === "M-202" ? "0,24 20,20 40,18 60,22 80,18 100,20" : "0,28 20,26 40,24 60,22 80,18 100,12"}
                  />
                </svg>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button className="px-3 py-1 rounded border text-sm">Telemetry</button>
                <button className="px-3 py-1 rounded border text-sm">Logs</button>
                <button className="px-3 py-1 rounded bg-amber-400 text-slate-900 text-sm">Acknowledge</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-4 border shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Machine faults history</div>
            <div className="text-xs text-slate-500">Last 30 days</div>
          </div>

          <div className="text-sm text-slate-600">No critical faults in the last 24 hours. Use the filters to view by line, severity or date range.</div>
        </div>
      </div>
    </div>
  );
}

export default function MachinesPage() {
  return (
    <RequireAuth>
      <MachinesContent />
    </RequireAuth>
  );
}
