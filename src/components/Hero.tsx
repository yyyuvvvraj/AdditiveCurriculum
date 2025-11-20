import React from "react";
import MiniDashboardPreview from "./MiniDashboardPreview";

export default function Hero() {
  return (
    <section className="py-20 bg-gradient-to-br from-sky-700 via-cyan-600 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Real-time monitoring for critical spare parts and consumables
          </h2>
          <p className="mt-4 text-sky-100/90 text-lg">
            Proactive inventory control, machine performance insights, and instant alerts — centralized for Vasus
            Brakes India Pvt Ltd.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="#dashboards"
              className="inline-flex bg-white/10 border border-white/20 px-5 py-3 rounded-lg backdrop-blur-md hover:scale-[1.02] transition"
            >
              See Dashboards
            </a>
            <a
              href="#contact"
              className="inline-flex bg-amber-400 text-slate-900 px-5 py-3 rounded-lg shadow hover:translate-y-[-2px] transition"
            >
              Request Trial
            </a>
          </div>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-sky-100">
            <li>• Low-inventory alerts</li>
            <li>• Live consumption rates</li>
            <li>• Machine downtime tracking</li>
            <li>• Role-based access & reporting</li>
          </ul>
        </div>

        <div>
          <div className="rounded-3xl border border-white/10 p-5 bg-white/6 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-sky-100/80">Spare Parts Inventory</h3>
                <p className="text-2xl font-semibold text-white">92% in-stock</p>
              </div>
              <div className="text-xs text-sky-100/70">Updated 2m ago</div>
            </div>

            <MiniDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
