import React from "react";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section id="features" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>What the platform offers</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Inventory Intelligence" desc="Track stock levels of critical spares and consumables with trend insights." hint="Forecast reorder windows and avoid line stoppage." icon={<span>📦</span>} />

          <FeatureCard title="Live Machine Telemetry" desc="Connect PLC/SCADA data to monitor runtime, faults, and performance KPIs." hint="Supports OPC UA / MQTT / REST inputs." icon={<span>⚙️</span>} />

          <FeatureCard title="Alerts & Notifications" desc="Multi-channel alerts for low inventory or critical downtimes." hint="Escalation rules & acknowledgement tracking included." icon={<span>🚨</span>} />
        </div>
      </div>
    </section>
  );
}
