// src/app/page.tsx
"use client";
import React from "react";
import Link from "next/link";

// --- VISUAL ASSETS ---
const GridPattern = () => (
  <svg className="absolute inset-0 -z-10 h-full w-full stroke-slate-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
    <defs>
      <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
        <path d="M100 200V.5M.5 .5H200" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth="0" fill="white" />
    <svg x="50%" y="-1" className="overflow-visible fill-slate-50">
      <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" strokeWidth="0" />
    </svg>
    <rect width="100%" height="100%" strokeWidth="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
  </svg>
);

// --- COMPONENTS ---

const HeroSection = () => (
  <div className="relative isolate pt-14 overflow-hidden">
    <GridPattern />
    
    <div className="py-24 sm:py-32 lg:pb-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 ring-1 ring-slate-900/10 hover:ring-slate-900/20 bg-white/50 backdrop-blur-sm">
              New: AI-Driven Failure Prediction <a href="/machines" className="font-semibold text-indigo-600"></a>
            </div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Industrial Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Modern Manufacturing</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Vasus Brakes Control Tower monitors 50+ critical machines, optimizes 1000+ spare parts, and prevents downtime before it happens.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/dashboard" className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:-translate-y-1">
              Launch Dashboard
            </Link>
            <a href="#features" className="text-sm font-bold leading-6 text-slate-900 hover:text-indigo-600 transition-colors">
              Explore Modules <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        
        {/* 3D Dashboard Preview Mockup */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 overflow-hidden">
               {/* Simulated Dashboard UI Header */}
               <div className="h-8 bg-slate-100 border-b flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
               </div>
               {/* Content Preview */}
               <div className="p-8 bg-slate-50 grid grid-cols-3 gap-6 opacity-80 pointer-events-none select-none">
                  <div className="col-span-2 h-64 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-300 font-bold text-2xl">LIVE OEE ANALYTICS</div>
                  <div className="col-span-1 space-y-4">
                      <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-emerald-500 font-bold">98% HEALTH</div>
                      <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-amber-500 font-bold">LOW STOCK</div>
                      <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-200"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatTicker = () => (
  <div className="bg-slate-900 py-12 sm:py-16">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
          <dt className="text-base leading-7 text-slate-400">Active Machines</dt>
          <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">50+</dd>
        </div>
        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
          <dt className="text-base leading-7 text-slate-400">Inventory SKUs</dt>
          <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">1,000+</dd>
        </div>
        <div className="mx-auto flex max-w-xs flex-col gap-y-4">
          <dt className="text-base leading-7 text-slate-400">Uptime Efficiency</dt>
          <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">99.9%</dd>
        </div>
      </dl>
    </div>
  </div>
);

const FeatureBento = () => (
  <div id="features" className="py-24 sm:py-32 bg-white">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h2 className="text-base font-bold leading-7 text-indigo-600 uppercase tracking-wide">Modules</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to run a smart factory</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Machines */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-8 hover:shadow-xl transition-all group">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
           <div className="relative z-10">
             <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center mb-6 shadow-md">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Predictive Maintenance</h3>
             <p className="text-slate-600 mb-6 max-w-md">Monitor vibration, temperature, and health scores in real-time. Our AI predicts failures before they halt production.</p>
             <Link href="/machines" className="text-sm font-bold text-red-600 flex items-center gap-1 hover:gap-2 transition-all">Explore Telemetry &rarr;</Link>
           </div>
        </div>

        {/* Card 2: Inventory */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-8 hover:shadow-xl transition-all group">
           <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
           <div className="relative z-10">
             <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-6 shadow-md">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Inventory</h3>
             <p className="text-slate-600 mb-6 text-sm">Auto-reorder triggers and live stock tracking for 1000+ SKUs.</p>
             <Link href="/inventory" className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">Manage Stock &rarr;</Link>
           </div>
        </div>

        {/* Card 3: Consumption */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-200 p-8 hover:shadow-xl transition-all group">
           <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
           <div className="relative z-10">
             <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-6 shadow-md">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Cost Analysis</h3>
             <p className="text-slate-600 mb-6 text-sm">Track spend velocity and optimize resource allocation.</p>
             <Link href="/consumption" className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">View Reports &rarr;</Link>
           </div>
        </div>

        {/* Card 4: Admin */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:shadow-xl transition-all group">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Plant Command Center</h3>
                <p className="text-slate-400 mb-0 max-w-lg">A unified admin console to manage users, view global alerts, and oversee the procurement pipeline.</p>
             </div>
             <Link href="/admin" className="whitespace-nowrap rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition-colors">
                Open Console
             </Link>
           </div>
        </div>

      </div>
    </div>
  </div>
);

const CTASection = () => (
  <div className="bg-indigo-700">
    <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to optimize your plant?
          <br />
          Start monitoring today.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
          Join the industrial revolution with Vasus Brakes' advanced telemetry and inventory systems.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get started
          </Link>
          <a href="#" className="text-sm font-semibold leading-6 text-white">
            Contact sales <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-800 bg-white">
      <main>
        <HeroSection />
        <StatTicker />
        <FeatureBento />
        <CTASection />
      </main>
    </div>
  );
};

export default LandingPage;