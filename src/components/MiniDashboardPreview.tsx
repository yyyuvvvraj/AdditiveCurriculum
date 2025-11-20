import React from "react";

export default function MiniDashboardPreview() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="h-28 rounded-xl p-3 border bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm flex flex-col justify-between shadow-inner">
        <div className="text-xs text-slate-500">Daily Consumption</div>
        <svg viewBox="0 0 100 30" className="w-full h-16" preserveAspectRatio="none">
          <polyline fill="none" stroke="#0ea5a4" strokeWidth={2} points="0,25 10,18 20,23 30,12 40,14 50,9 60,11 70,6 80,8 90,3 100,5" />
        </svg>
      </div>

      <div className="h-28 rounded-xl p-3 border bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-sm shadow-inner">
        <div className="text-xs text-slate-500">Machine Uptime</div>
        <div className="flex items-end gap-3 h-16 mt-2">
          <div className="flex-1 h-full flex items-end">
            <div className="w-full rounded-md" style={{ height: "56%", background: "linear-gradient(180deg,#34d399,#06b6d4)" }} />
          </div>
          <div className="w-1/4 h-full flex items-end">
            <div className="w-full rounded-md bg-slate-200" style={{ height: "78%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
