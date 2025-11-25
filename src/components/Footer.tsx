"use client";
import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg" style={{ background: 'linear-gradient(180deg,var(--primary),var(--primary-600))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
              VB
            </div>
            <div>
              <div className="font-bold">Vasus Brakes</div>
              <div className="text-xs muted">Control Tower</div>
            </div>
          </div>

          <div className="muted text-sm">© {new Date().getFullYear()} Vasus Brakes India Pvt Ltd. All rights reserved.</div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="muted">Privacy</Link>
            <Link href="/terms" className="muted">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}