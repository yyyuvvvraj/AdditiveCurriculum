import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-sm">
        <div>© {new Date().getFullYear()} Vasus Brakes India Pvt Ltd — Real-time Monitoring Suite</div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#contact" className="text-amber-300 hover:text-amber-200">Contact</a>
        </div>
      </div>
    </footer>
  );
}
