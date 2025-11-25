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
        <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Alerts & notifications</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="card p-4">
              <h4 className="font-semibold mb-3">Active alerts</h4>
              <ul className="space-y-3">
                {alerts.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center text-white`} style={{ background: a.type === "Machine" ? 'var(--danger)' : 'var(--warning)' }}>{a.type[0]}</div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{a.message}</div>
                      <div className="text-xs muted">{new Date(a.created_at).toLocaleString()}</div>
                    </div>
                    <div className="ml-auto text-xs">
                      <button className="btn ghost px-3 py-1 text-sm">Acknowledge</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-sm muted">Configure alerts by threshold, severity, delivery channel (email/SMS/webhook) and add escalation rules.</div>
          </div>

          <div>
            <div className="card p-4">
              <h4 className="font-semibold mb-3">Notification settings</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Low stock email</div>
                    <div className="text-xs muted">Notify supply chain team when stock &lt; reorder point</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Critical downtime SMS</div>
                    <div className="text-xs muted">Immediate SMS to engineers when downtime exceeds 5 min</div>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div className="text-sm muted">Webhook endpoints, escalation chains, and acknowledgement logging are available in the admin console.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
