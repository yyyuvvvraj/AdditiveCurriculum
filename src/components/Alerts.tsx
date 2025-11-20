"use client";
import React from "react";

export default function Alerts() {
  const alerts = [
    { id: 1, type: "Inventory", message: "Brake pad stock below reorder level (Plant B)", severity: "critical", created_at: new Date().toISOString() },
    { id: 2, type: "Machine", message: "Unexpected stop: Line 2, Station 4", severity: "critical", created_at: new Date().toISOString() },
  ];

  return (
    <section id="alerts" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Alerts & notifications</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="rounded-2xl bg-white p-4 border shadow-lg">
              <h4 className="font-semibold mb-3">Active alerts</h4>
              <ul className="space-y-3">
                {alerts.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center text-white ${a.type === "Machine" ? "bg-red-500" : "bg-amber-500"}`}>{a.type[0]}</div>
                    <div>
                      <div className="text-sm font-medium">{a.message}</div>
                      <div className="text-xs text-slate-400">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                    <div className="ml-auto text-xs">
                      <button className="px-3 py-1 rounded-md border hover:bg-slate-50 transition">Acknowledge</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm text-slate-600">Configure alerts by threshold, severity, delivery channel (email/SMS/webhook) and add escalation rules.</div>
          </div>

          <div>
            <div className="rounded-2xl bg-gradient-to-br from-white to-white/60 p-4 border shadow-lg">
              <h4 className="font-semibold mb-3">Notification settings</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Low stock email</div>
                    <div className="text-xs text-slate-400">Notify supply chain team when stock &lt; reorder point</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Critical downtime SMS</div>
                    <div className="text-xs text-slate-400">Immediate SMS to engineers when downtime exceeds 5 min</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div className="text-sm text-slate-500">Webhook endpoints, escalation chains, and acknowledgement logging are available in the admin console.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
