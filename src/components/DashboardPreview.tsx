import React from "react";

export default function DashboardPreview({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="font-semibold">{subtitle}</div>
        </div>
        <div className="text-xs text-amber-500">live</div>
      </div>

      <div className="h-44 rounded-md border-dashed border-2 border-slate-100 flex items-center justify-center text-slate-300">
        Dashboard embed placeholder
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div>Updated: 3m ago</div>
        <div>Source: SCADA</div>
      </div>
    </div>
  );
}
