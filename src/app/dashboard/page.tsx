// src/app/dashboard/page.tsx
"use client";
import React from "react";
import RequireAuth from "@/components/RequireAuth";
import OEEChart from "@/components/charts/OEEChart";
import ConsumptionChart from "@/components/charts/ConsumptionChart";
import ModuleCard from "@/components/ModuleCard";

function DashboardContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-800">Operations Dashboard</h1>
          <div className="text-sm text-slate-500">Live • Updated: a minute ago</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="col-span-2 rounded-2xl bg-white p-4 border shadow-lg">
            <div className="mb-3">
              <div className="text-sm text-slate-500">OEE overview</div>
              <div className="text-2xl font-semibold text-slate-800">78%</div>
            </div>
            <OEEChart />
          </div>

          <div className="rounded-2xl bg-white p-4 border shadow-lg">
            <div className="text-sm text-slate-500 mb-2">Key KPIs</div>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 rounded-lg bg-white/60">
                <div className="text-xs text-slate-500">Plant A In-stock</div>
                <div className="font-semibold text-lg text-slate-800">92%</div>
              </div>

              <div className="p-3 rounded-lg bg-white/60">
                <div className="text-xs text-slate-500">Avg Lead Time</div>
                <div className="font-semibold text-lg text-slate-800">5 days</div>
              </div>

              <div className="p-3 rounded-lg bg-white/60">
                <div className="text-xs text-slate-500">Critical Alerts</div>
                <div className="font-semibold text-lg text-red-500">2</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold my-4 text-slate-800">Consumption — last 7 days</h3>
        <div className="rounded-2xl bg-white p-4 border shadow-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-500">Brake Pads</div>
            <div className="text-xs text-slate-500">Units / day</div>
          </div>
          <ConsumptionChart />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ModuleCard title="Spare Parts Inventory" bullets={["Real-time stock", "Reorder forecasts"]} cta={{ label: "Open Inventory", href: "/inventory" }} />
          <ModuleCard title="Consumption Rates" bullets={["Per-line consumption", "7d trends"]} cta={{ label: "View Consumption", href: "/consumption" }} />
          <ModuleCard title="Machine Performance" bullets={["Uptime heatmaps", "Fault summaries"]} cta={{ label: "View Machines", href: "/machines" }} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
