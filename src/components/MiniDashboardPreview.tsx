import React from "react";

export default function MiniDashboardPreview() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="h-28 rounded-xl p-3 card flex flex-col justify-between">
        <div className="text-xs muted">Daily Consumption</div>
        <svg viewBox="0 0 100 30" className="w-full h-16" preserveAspectRatio="none">
          <polyline fill="none" stroke="var(--accent)" strokeWidth={2} points="0,25 10,18 20,23 30,12 40,14 50,9 60,11 70,6 80,8 90,3 100,5" />
        </svg>
      </div>

      <div className="h-28 rounded-xl p-3 card">
        <div className="text-xs muted">Machine Uptime</div>
        <div className="flex items-end gap-3 h-16 mt-2">
          <div className="flex-1 h-full flex items-end">
            <div className="w-full rounded-md" style={{ height: "56%", background: "linear-gradient(180deg,var(--success),var(--accent))" }} />
          </div>
          <div className="w-1/4 h-full flex items-end">
            <div className="w-full rounded-md" style={{ height: "78%", background: 'var(--muted-surface)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
