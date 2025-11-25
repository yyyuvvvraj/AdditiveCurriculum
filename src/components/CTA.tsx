import React from "react";

export default function CTA() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Ready to prevent unplanned stoppages?</h4>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Book a demo and see how the Monitoring Suite fits into your plant.</p>
        </div>

        <a href="#contact" className="btn primary">Book a demo</a>
      </div>
    </section>
  );
}
