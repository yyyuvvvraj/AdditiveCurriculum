// src/app/alerts/page.tsx
"use client";
import React, { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import TopNav from "@/components/TopNav";

type Alert = { id: string; type: string; message: string; severity: "info" | "warning" | "critical"; created_at: string; ack?: boolean };

const demoAlerts: Alert[] = [
  { id: "a1", type: "Inventory", message: "Brake pad stock below reorder level (Plant B)", severity: "critical", created_at: new Date().toISOString(), ack: false },
  { id: "a2", type: "Machine", message: "Unexpected stop: Line 2, Station 4", severity: "critical", created_at: new Date().toISOString(), ack: false },
  { id: "a3", type: "Info", message: "Weekly report ready", severity: "info", created_at: new Date().toISOString(), ack: true },
];

function SeverityIcon({ s }: { s: Alert["severity"] }) {
  if (s === "critical") return <div className="w-10 h-10 rounded-md bg-red-500 text-white flex items-center justify-center font-bold">!</div>;
  if (s === "warning") return <div className="w-10 h-10 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold">!</div>;
  return <div className="w-10 h-10 rounded-md bg-sky-500 text-white flex items-center justify-center font-bold">i</div>;
}

function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);

  function toggleAck(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ack: !a.ack } : a)));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Alerts & Notifications</h1>
            <div className="text-sm text-slate-500">Acknowledge to silence / escalate</div>
          </div>
          <div className="text-sm text-slate-500">Acknowledge to silence / escalate</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alerts.map((a) => (
            <div key={a.id} className={`bg-white rounded-2xl p-4 border ${a.severity === "critical" ? "border-red-200" : a.severity === "warning" ? "border-amber-200" : "border-slate-100"} shadow`}>
              <div className="flex items-start gap-4">
                <SeverityIcon s={a.severity} />
                <div className="flex-1">
                  <div className={`font-medium text-slate-800 ${a.ack ? "line-through text-slate-400" : ""}`}>{a.message}</div>
                  <div className="text-xs text-slate-500 mt-1">{new Date(a.created_at).toLocaleString()}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => toggleAck(a.id)} className={`px-3 py-1 rounded ${a.ack ? "bg-slate-100 text-slate-600" : "bg-amber-400 text-slate-900"}`}>
                    {a.ack ? "Unack" : "Acknowledge"}
                  </button>
                  <button className="px-3 py-1 rounded border text-sm">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AlertsPage() {
  return (
    <RequireAuth>
      <AlertsContent />
    </RequireAuth>
  );
}
