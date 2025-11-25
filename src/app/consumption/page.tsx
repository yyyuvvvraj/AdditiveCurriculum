// src/app/consumption/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { fetchConsumptionMetrics, ConsumptionMetrics } from "@/lib/api";

// --- HELPER: FORMAT CURRENCY ---
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- VISUAL: SEGMENTED CONTROL ---
function TimeRangeSelector({ current, onChange }: { current: string, onChange: (v: any) => void }) {
  return (
    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-sm">
      {['Monthly', 'Quarterly', 'Yearly'].map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
            current === range 
              ? 'bg-cyan-600 text-slate-900 shadow-sm' 
              : 'text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}

// --- VISUAL: KPI CARD ---
function KPICard({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="card p-5 rounded-2xl border border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-cyan-600 opacity-5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-150`}></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-extrabold text-slate-100 mt-2 group-hover:text-cyan-400 transition-colors">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-cyan-600`}>
            {icon}
        </div>
      </div>
      
      <div className="mt-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg bg-slate-700/50 text-xs font-medium text-slate-300 group-hover:bg-cyan-950/30 group-hover:text-cyan-300 transition-colors">
          {sub} &rarr;
        </span>
      </div>
    </div>
  );
}

// --- VISUAL: BAR CHART (FIXED HEIGHTS) ---
function BarChart({ data }: { data: { label: string; cost: number; units: number }[] }) {
  // Determine scaling factor
  const maxVal = Math.max(...data.map(d => d.cost)) * 1.1 || 100; 
  
  return (
    // Fixed height container (h-60) allows children to calculate percentages correctly
    <div className="w-full h-60 pt-6 flex items-end justify-between gap-3 select-none">
      {data.map((d, i) => {
        const heightPercent = Math.max((d.cost / maxVal) * 100, 4); // Min 4% height
        
        return (
          <div key={i} className="h-full flex-1 flex flex-col justify-end group cursor-pointer relative">
            
            {/* Tooltip (Visible on Hover) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
               <div className="bg-slate-700 text-slate-100 text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap">
                  {formatINR(d.cost)}
               </div>
               {/* Tiny arrow */}
               <div className="w-2 h-2 bg-slate-700 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
            </div>

            {/* Bar Track (Gray Background) */}
            <div className="relative w-full bg-slate-700/50 rounded-t-lg overflow-hidden flex-1">
               {/* Animated Bar (Colored Fill) */}
               <div 
                 className="absolute bottom-0 w-full bg-indigo-500 transition-all duration-700 ease-out group-hover:bg-indigo-600"
                 style={{ height: `${heightPercent}%` }}
               />
            </div>

            {/* Label */}
            <div className="h-8 flex items-center justify-center mt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase truncate w-full text-center">
                    {d.label}
                </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- MAIN PAGE ---
function ConsumptionContent() {
  const [timeRange, setTimeRange] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConsumptionMetrics | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetchConsumptionMetrics(timeRange);
        if (isMounted) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [timeRange]);

  if (!data && !loading) return <div className="p-10 text-center text-slate-400">Unable to load data.</div>;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">Resource Consumption</h1>
            <div className="text-sm text-slate-400 mt-1">Operational costs & material usage analysis</div>
          </div>
          <TimeRangeSelector current={timeRange} onChange={setTimeRange} />
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? [1,2,3].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700"/>) : (
            <>
              <KPICard 
                title="Total Spend" 
                value={formatINR(data!.kpi.totalCost)} 
                sub={`Verified spend for ${timeRange}`} 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
              />
              <KPICard 
                title="Material Units" 
                value={data!.kpi.totalUnits.toLocaleString()} 
                sub="Total parts & consumables" 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>} 
              />
              <KPICard 
                title="Efficiency Score" 
                value={`${data!.kpi.efficiency.toFixed(1)}%`} 
                sub="Budget utilization rate" 
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>} 
              />
            </>
          )}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: COST CHART */}
          <div className="lg:col-span-2 card p-6 rounded-2xl border border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-100">Cost Analysis</h3>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                 <span className="text-xs font-medium text-slate-400 uppercase">Spend Trend</span>
              </div>
            </div>
            
            {/* Key prop forces re-mount on range change to trigger animations */}
            {loading ? (
                <div className="h-60 flex items-center justify-center text-slate-400">Loading chart...</div>
            ) : (
                <BarChart key={timeRange} data={data!.trend} />
            )}
          </div>

          {/* RIGHT COL: CATEGORY BREAKDOWN */}
          <div className="card p-6 rounded-2xl border border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-100 mb-6">Category Split</h3>
            {loading ? <div className="h-40 bg-slate-700/50 animate-pulse rounded border border-slate-700"/> : (
              <div className="space-y-6">
                {data!.breakdown.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-300">{item.category}</span>
                      <span className="font-bold text-slate-100">{item.value}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-700/50 rounded-full overflow-hidden border border-slate-700">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* TABLE SECTION */}
        <div className="mt-8 card rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-100">High Value Consumption</h3>
            <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800">Export Report</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/30 text-slate-400 font-medium border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Part Name</th>
                <th className="px-6 py-3">Usage Count</th>
                <th className="px-6 py-3">Total Cost</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-300">Loading data...</td></tr>
              ) : (
                data!.topParts.map((part) => (
                  <tr key={part.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-100">
                      {part.name} <span className="text-slate-400 font-normal ml-1">#{part.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{part.usage.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-slate-100">{formatINR(part.cost)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        part.status === 'Critical' ? 'bg-red-950/30 text-red-300' : 
                        part.status === 'High Cost' ? 'bg-amber-950/30 text-amber-300' : 
                        'bg-emerald-950/30 text-emerald-300'
                      }`}>
                        {part.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default function ConsumptionPage() {
  return <RequireAuth><ConsumptionContent /></RequireAuth>;
}