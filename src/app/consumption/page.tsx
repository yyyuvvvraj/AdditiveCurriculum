// src/app/consumption/page.tsx
"use client";
import React from "react";
import RequireAuth from "@/components/RequireAuth";
import ConsumptionChart from "@/components/charts/ConsumptionChart";

function ConsumptionContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800">Consumption Rates</h1>
          <div className="text-sm text-slate-500">Per-line & part level trends</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 rounded-2xl bg-white p-4 border shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-slate-500">Brake Pads — last 7 days</div>
                <div className="text-lg font-semibold text-slate-800">Avg 145 / day</div>
              </div>
              <div className="text-xs text-amber-500">live</div>
            </div>

            <ConsumptionChart />
          </div>

          <div className="rounded-2xl bg-white p-4 border shadow-lg">
            <h4 className="font-semibold mb-2">Top consumers</h4>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>Line 1 — 320 units/week</li>
              <li>Line 3 — 290 units/week</li>
              <li>Line 2 — 210 units/week</li>
            </ul>
            <div className="mt-4 text-xs text-slate-500">Use filters above to show part-level or date-range breakdowns.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConsumptionPage() {
  return (
    <RequireAuth>
      <ConsumptionContent />
    </RequireAuth>
  );
}
