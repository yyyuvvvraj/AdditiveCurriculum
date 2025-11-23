// src/app/alerts/page.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import RequireAuth from "@/components/RequireAuth";
import { fetchMachines, fetchInventory, MachineItem, InventoryItem } from "@/lib/api";

// --- TYPES ---
type Alert = {
  id: string;
  sourceId: string; // ID of the machine or part
  type: "Inventory" | "Machine" | "System";
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
};

// --- HELPER: ICONS ---
const Icons = {
  Inventory: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
  ),
  Machine: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
  ),
  System: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
  )
};

function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [ackedIds, setAckedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function generateAlerts() {
      // 1. Load Acked IDs from Storage
      const storedAcks = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
      const ackSet = new Set<string>(storedAcks);
      setAckedIds(ackSet);

      // 2. Fetch Real Data
      const [machines, inventory] = await Promise.all([fetchMachines(), fetchInventory()]);
      
      const newAlerts: Alert[] = [];

      // 3. Generate Machine Alerts
      machines.forEach(m => {
        if (m.status === 'CRITICAL' || m.status === 'WARNING') {
            const alertId = `AL-${m.id}-${m.status}`;
            if (!ackSet.has(alertId)) {
                newAlerts.push({
                    id: alertId,
                    sourceId: m.id,
                    type: "Machine",
                    message: `${m.name}: ${m.prediction}`,
                    severity: m.status === 'CRITICAL' ? 'critical' : 'warning',
                    timestamp: m.lastUpdated
                });
            }
        }
      });

      // 4. Generate Inventory Alerts (Limit to top 20 to avoid flooding)
      inventory.filter(i => i.status === 'Critical').slice(0, 20).forEach(i => {
          const alertId = `AL-${i.id}-LOWSTOCK`;
          if (!ackSet.has(alertId)) {
              newAlerts.push({
                  id: alertId,
                  sourceId: i.id,
                  type: "Inventory",
                  message: `Low Stock: ${i.name} (${i.stock} units remaining)`,
                  severity: 'warning',
                  timestamp: new Date().toISOString()
              });
          }
      });

      setAlerts(newAlerts);
      setLoading(false);
    }
    generateAlerts();
  }, []);

  // --- ACTIONS ---

  const handleAck = (id: string) => {
    // Add to local state
    setAckedIds(prev => {
        const next = new Set(prev).add(id);
        // Save to storage
        localStorage.setItem('acknowledgedAlerts', JSON.stringify(Array.from(next)));
        return next;
    });
    // Remove from current view
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleDismissAll = () => {
    if (!confirm("Acknowledge all current alerts?")) return;
    
    const allIds = alerts.map(a => a.id);
    const combined = new Set([...Array.from(ackedIds), ...allIds]);
    
    setAckedIds(combined);
    localStorage.setItem('acknowledgedAlerts', JSON.stringify(Array.from(combined)));
    setAlerts([]);
  };

  // --- FILTERING ---
  const visibleAlerts = useMemo(() => {
      if (filter === 'ALL') return alerts;
      return alerts.filter(a => a.severity.toUpperCase() === filter);
  }, [alerts, filter]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Alerts & Notifications</h1>
            <div className="text-sm text-slate-500 mt-1">
                {loading ? "Scanning system..." : `${alerts.length} active issues require attention`}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {alerts.length > 0 && (
                 <button onClick={handleDismissAll} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                    Dismiss All
                 </button>
             )}
             <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                {['ALL', 'CRITICAL', 'WARNING'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === f ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {f}
                    </button>
                ))}
             </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-white rounded-xl border shadow-sm animate-pulse"></div>
                ))}
            </div>
        )}

        {/* Empty State */}
        {!loading && alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border shadow-sm text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">All Systems Nominal</h3>
                <p className="text-slate-500 mt-2 max-w-sm">No active alerts. Machines are running optimally and inventory levels are stable.</p>
                <button onClick={() => { localStorage.removeItem('acknowledgedAlerts'); window.location.reload(); }} className="mt-6 px-4 py-2 text-sm text-indigo-600 hover:underline">
                    Reset Demo History
                </button>
            </div>
        )}

        {/* Alerts List */}
        {!loading && visibleAlerts.length > 0 && (
            <div className="space-y-4">
                {visibleAlerts.map(alert => {
                    const isCritical = alert.severity === 'critical';
                    return (
                        <div 
                            key={alert.id} 
                            className={`flex items-start gap-4 p-5 rounded-xl border shadow-sm transition-all hover:shadow-md ${isCritical ? 'bg-red-50/50 border-red-200' : 'bg-amber-50/50 border-amber-200'}`}
                        >
                            {/* Icon Box */}
                            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${isCritical ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {Icons[alert.type]}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-0.5">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-bold ${isCritical ? 'text-red-900' : 'text-amber-900'}`}>
                                        {alert.type}: <span className="font-medium">{alert.sourceId}</span>
                                    </h4>
                                    <span className="text-xs font-medium text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className={`mt-1 text-sm ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>{alert.message}</p>
                                
                                <div className="mt-3 flex items-center gap-3">
                                    <button 
                                        onClick={() => handleAck(alert.id)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border shadow-sm transition-colors ${isCritical ? 'bg-white border-red-200 text-red-700 hover:bg-red-50' : 'bg-white border-amber-200 text-amber-700 hover:bg-amber-50'}`}
                                    >
                                        Acknowledge
                                    </button>
                                    {alert.type === 'Machine' && (
                                        <a href="/machines" className="text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline">View Machine &rarr;</a>
                                    )}
                                    {alert.type === 'Inventory' && (
                                        <a href="/inventory" className="text-xs font-medium text-slate-500 hover:text-slate-800 hover:underline">Check Stock &rarr;</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

      </div>
    </div>
  );
}

export default function AlertsPage() {
  return (
    <RequireAuth>
      <AlertsContent />
    </RequireAuth>
  );
}