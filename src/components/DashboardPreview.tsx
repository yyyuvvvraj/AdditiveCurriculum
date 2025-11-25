import React from "react";

export default function DashboardPreview({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm muted">{title}</div>
          <div className="font-semibold">{subtitle}</div>
        </div>
        <div className="text-xs" style={{ color: 'var(--warning)' }}>live</div>
      </div>

      <div className="h-44 rounded-md flex items-center justify-center" style={{ borderStyle: 'dashed', borderWidth: 2, borderColor: 'var(--border)', color: 'var(--muted)' }}>
        Dashboard embed placeholder
      </div>

      <div className="mt-3 flex items-center justify-between text-xs muted">
        <div>Updated: 3m ago</div>
        <div>Source: SCADA</div>
      </div>
    </div>
  );
}
