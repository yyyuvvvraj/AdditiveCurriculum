// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import MaintenanceOptimizer from "@/components/MaintenanceOptimizer";
import Chatbot from "@/components/Chatbot";
import useRealtime from "@/hooks/useRealtime";
import { fetchMachines, fetchInventory } from "@/lib/api";

// --- VISUAL COMPONENT: MODERN HEALTH GAUGE ---
function HealthGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = "text-emerald-500";
  if (score < 75) color = "text-amber-500";
  if (score < 50) color = "text-red-500";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow Ring */}
      <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${color.replace('text-', 'bg-')}`}></div>
      
      <svg className="transform -rotate-90 w-48 h-48 relative z-10">
        {/* Track */}
        <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
        {/* Indicator */}
        <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <span className="text-5xl font-black text-slate-100 tracking-tighter">{score}%</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Health Index</span>
      </div>
    </div>
  );
}

// --- VISUAL COMPONENT: METRIC CARD ---
function MetricCard({ title, count, label, icon, color, href }: { title: string, count: number | string, label: string, icon: React.ReactNode, color: string, href: string }) {
  return (
    <Link href={href} className="block h-full">
      <div className="card p-5 rounded-3xl border border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-150`}></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{title}</p>
            <h3 className="text-4xl font-extrabold text-slate-100 mt-2 group-hover:text-cyan-400 transition-colors">{count}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${color}`}>
            {icon}
          </div>
        </div>
        
        <div className="mt-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-700/50 text-xs font-medium text-slate-300 group-hover:bg-cyan-950/30 group-hover:text-cyan-300 transition-colors">
            {label} &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

// --- MAIN DASHBOARD CONTENT ---
function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const { maintenanceOptimization } = useRealtime();
  
  const [stats, setStats] = useState({
    healthScore: 0,
    criticalMachines: 0,
    maintenanceCount: 0,
    lowStock: 0,
    totalMachines: 0
  });

  // Extracted function so we can call it from the "Sync" button
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    
    // 1. Fetch Base Data (Which respects LocalStorage persistence)
    const [machines, inventory] = await Promise.all([fetchMachines(), fetchInventory()]);
    
    // 2. Check Work Orders to find "Maintenance" status
    const storedWOs = JSON.parse(localStorage.getItem('pendingWorkOrders') || '[]');
    // Filter for active work orders (Pending or In Progress)
    const activeWOs = storedWOs.filter((w: any) => w.status !== 'Resolved');
    const maintenanceIds = new Set(activeWOs.map((w: any) => w.machineId));

    let totalHealth = 0;
    let crit = 0;
    let maint = 0;

    // 3. Calculate Stats - SAME LOGIC AS ADMIN PAGE
    machines.forEach(m => {
      // Priority: Maintenance > Critical > Normal
      if (maintenanceIds.has(m.id)) {
          maint++;
          // Maintenance machines shouldn't tank the score too hard, maybe treat as 70% health
      } else if (m.status === 'CRITICAL') {
          crit++;
      }
      
      // Aggregate health score
      totalHealth += m.health;
    });

    // Calculate Average Health
    const avgHealth = Math.round(totalHealth / (machines.length || 1));

    setStats({
      healthScore: avgHealth,
      criticalMachines: crit,
      maintenanceCount: maint,
      lowStock: inventory.filter(i => i.status === 'Critical').length,
      totalMachines: machines.length
    });
    
    setLoading(false);
  }, []);

  // Initial Load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">Control Tower</h1>
            <p className="text-slate-400 mt-1 font-medium">Real-time production oversight • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-sm text-xs font-bold text-emerald-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                LIVE FEED
             </div>
             
             {/* NEW REFRESH BUTTON */}
             <button 
                onClick={loadDashboardData}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-70"
             >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                {loading ? 'Syncing...' : 'Sync Data'}
             </button>
          </div>
        </div>

        {/* 2. BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: PLANT HEALTH (Large Square) */}
            <div className="card rounded-[2rem] p-8 border border-slate-700 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
                <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-950/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <h3 className="text-xl font-extrabold text-slate-100 mb-6 relative z-10">Overall Plant Efficiency</h3>
                {loading ? <div className="w-48 h-48 rounded-full border-4 border-slate-700 animate-pulse"/> : (
                    <HealthGauge score={stats.healthScore} />
                )}
                <div className="mt-6 text-sm font-medium text-slate-400 max-w-xs leading-relaxed relative z-10">
                    Aggregated telemetry from <strong className="text-slate-100">{stats.totalMachines} Active Units</strong> via SCADA integration.
                </div>
            </div>

            {/* RIGHT: METRICS GRID (2x2) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Critical Alerts */}
                <MetricCard 
                    title="Critical Failures" 
                    count={loading ? '-' : stats.criticalMachines}
                    label="View Machines"
                    href="/machines"
                    color="bg-red-500"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                />

                {/* 2. Maintenance */}
                <MetricCard 
                    title="Work Orders" 
                    count={loading ? '-' : stats.maintenanceCount}
                    label="Open Admin Console"
                    href="/admin"
                    color="bg-indigo-500"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
                />

                {/* 3. Low Stock */}
                <MetricCard 
                    title="Low Inventory" 
                    count={loading ? '-' : stats.lowStock}
                    label="Reorder Spare Parts"
                    href="/inventory"
                    color="bg-amber-500"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>}
                />

                {/* 4. Consumption */}
                <MetricCard 
                    title="Consumption" 
                    count="View"
                    label="Analyze Costs"
                    href="/consumption"
                    color="bg-teal-500"
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>}
                />
            </div>
        </div>

        {/* 3. GENETIC ALGORITHM MAINTENANCE OPTIMIZER */}
        <div className="mt-10">
            <MaintenanceOptimizer optimization={maintenanceOptimization} loading={loading} />
        </div>

        {/* 4. BOTTOM SECTION: QUICK LINKS */}
        <div className="mt-10">
            <h4 className="text-lg font-bold text-slate-100 mb-5 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span> 
                Module Access
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/inventory" className="group card p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="h-12 w-12 bg-cyan-950/30 text-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-slate-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    </div>
                    <h5 className="font-bold text-slate-100 mb-2">Inventory Management</h5>
                    <p className="text-sm text-slate-400">Manage 1000+ spare parts, track live stock levels, and automate reorder requests.</p>
                </Link>

                <Link href="/machines" className="group card p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="h-12 w-12 bg-red-950/30 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-slate-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <h5 className="font-bold text-slate-100 mb-2">Machine Telemetry</h5>
                    <p className="text-sm text-slate-400">Live vibration & temp monitoring for 50 units with AI-driven failure prediction.</p>
                </Link>

                <Link href="/alerts" className="group card p-6 rounded-2xl border border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="h-12 w-12 bg-amber-950/30 text-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    </div>
                    <h5 className="font-bold text-slate-100 mb-2">Alerts Center</h5>
                    <p className="text-sm text-slate-400">Centralized notification feed for all critical system events and escalation protocols.</p>
                </Link>
            </div>
        </div>

      </div>
      <Chatbot />
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