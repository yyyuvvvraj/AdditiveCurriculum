import React from "react";

export default function CTA() {
  return (
    <section className="py-12 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold">Ready to prevent unplanned stoppages?</h4>
          <p className="text-sm opacity-90">Book a demo and see how the Monitoring Suite fits into your plant.</p>
        </div>

        <a href="#contact" className="bg-slate-900 text-white px-5 py-3 rounded-lg shadow hover:scale-[1.02] transition">Book a demo</a>
      </div>
    </section>
  );
}
