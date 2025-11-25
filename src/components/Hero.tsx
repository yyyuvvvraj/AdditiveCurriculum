import React from "react";
import MiniDashboardPreview from "./MiniDashboardPreview";

export default function Hero() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight" style={{ color: 'var(--text)' }}>
            Real-time monitoring for critical spare parts and consumables
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--muted)' }}>
            Proactive inventory control, machine performance insights, and instant alerts — centralized for Vasus
            Brakes India Pvt Ltd.
          </p>

          <div className="mt-8 flex gap-4">
            <a href="#dashboards" className="btn ghost">
              See Dashboards
            </a>
            <a href="#contact" className="btn" style={{ background: 'var(--warning)', color: '#0b1220' }}>
              Request Trial
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: 'var(--muted)' }}>
            <li>• Low-inventory alerts</li>
            <li>• Live consumption rates</li>
            <li>• Machine downtime tracking</li>
            <li>• Role-based access & reporting</li>
          </ul>
        </div>

        <div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm muted">Spare Parts Inventory</h3>
                <p className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>92% in-stock</p>
              </div>
              <div className="text-xs muted">Updated 2m ago</div>
            </div>

            <MiniDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
