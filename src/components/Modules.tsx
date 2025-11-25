import React from "react";
import ModuleCard from "./ModuleCard";
import DashboardPreview from "./DashboardPreview";

export default function Modules() {
  return (
    <section id="dashboards" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>Module snapshots</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModuleCard title="Spare Parts Inventory" bullets={["Real-time stock levels", "Reorder forecasts", "Supplier lead-time view"]} cta={{ label: "Open Inventory", href: "#" }} />

          <ModuleCard title="Consumption Rates" bullets={["Per-line consumption", "Weekly trends", "Consumption per product"]} cta={{ label: "View Consumption", href: "#" }} />

          <ModuleCard title="Machine Performance" bullets={["Uptime/downtime heatmaps", "OEE KPIs", "Fault summaries"]} cta={{ label: "View Machines", href: "#" }} />
        </div>

        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Live preview</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <DashboardPreview title="Inventory Levels" subtitle="Plant A - Line 3" />
            <DashboardPreview title="Consumption (7d)" subtitle="Brake Pads" />
            <DashboardPreview title="Machine Downtime" subtitle="Last 24h" />
          </div>
        </div>
      </div>
    </section>
  );
}
