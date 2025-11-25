// src/app/machines/page.tsx
"use client";
import React, { useEffect, useState, useMemo } from "react";
import RequireAuth from "@/components/RequireAuth";
import { fetchMachines, MachineItem } from "@/lib/api";

// --- 1. HELPER: STATUS COLORS (Now includes Card Backgrounds) ---
const getStatusColor = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'MAINTENANCE') return { 
      cardBg: 'bg-slate-800/50', 
      border: 'border-indigo-900/50', 
      text: 'text-indigo-400', 
      dot: 'bg-indigo-500',
      badge: 'bg-indigo-950/30' 
  };
  if (s === 'WARNING') return { 
      cardBg: 'bg-slate-800/50', 
      border: 'border-amber-900/50', 
      text: 'text-amber-400', 
      dot: 'bg-amber-500',
      badge: 'bg-amber-950/30' 
  };
  if (s === 'CRITICAL' || s === 'STOPPED' || s === 'FAILURE') return { 
      cardBg: 'bg-slate-800/50', 
      border: 'border-red-900/50', 
      text: 'text-red-400', 
      dot: 'bg-red-500',
      badge: 'bg-red-950/30' 
  };
  // Default / Normal
  return { 
      cardBg: 'bg-slate-800/50', 
      border: 'border-emerald-900/50', 
      text: 'text-emerald-400', 
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-950/30' 
  };
};

// --- 2. VISUAL COMPONENTS ---
function HealthGauge({ value, size = "md" }: { value: number, size?: "md" | "lg" }) {
  const radius = size === "lg" ? 30 : 18;
  const width = size === "lg" ? 80 : 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  // Dynamic Color for the gauge ring itself
  const color = value >= 90 ? "text-emerald-500" : value >= 70 ? "text-amber-500" : "text-red-500";

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${size === "lg" ? "w-20 h-20" : "w-14 h-14"}`}>
      <svg className={`transform -rotate-90 ${size === "lg" ? "w-20 h-20" : "w-14 h-14"}`}>
        {/* Background Ring */}
        <circle cx={width/2} cy={width/2} r={radius} stroke="currentColor" strokeWidth={size==="lg"?6:4} fill="transparent" className="text-slate-700" />
        {/* Value Ring */}
        <circle cx={width/2} cy={width/2} r={radius} stroke="currentColor" strokeWidth={size==="lg"?6:4} fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className={`${color} transition-all duration-1000`} />
      </svg>
      <span className={`absolute font-bold ${color} ${size === "lg" ? "text-xl" : "text-xs"}`}>{value}%</span>
    </div>
  );
}

function MetricBar({ label, value, max, unit }: { label: string, value: number, max: number, unit: string }) {
    const percent = Math.min(100, (value / max) * 100);
    const barColor = percent > 85 ? 'bg-red-500' : percent > 60 ? 'bg-amber-500' : 'bg-emerald-500';
    return (
        <div className="w-full mb-1">
            <div className="flex justify-between text-xs mb-1 text-slate-400">
                <span className="font-medium">{label}</span>
                <span className="font-bold text-slate-300">{value}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

function LiveSparkline({ baseValue, variance, color }: { baseValue: number, variance: number, color: string }) {
  const points = useMemo(() => Array.from({ length: 20 }).map(() => baseValue + (Math.random() - 0.5) * variance), [baseValue, variance]);
  const min = Math.min(...points) - 1;
  const range = Math.max(...points) - min + 1;
  const polylinePoints = points.map((p, i) => `${(i / 19) * 100},${100 - ((p - min) / range) * 100}`).join(" ");

  return (
    <div className="h-12 w-full mt-2 opacity-70 overflow-hidden relative">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={polylinePoints} className={color} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-800/30 via-transparent to-transparent`}></div>
    </div>
  );
}

// --- 3. MODAL COMPONENT ---
function MachineDetailsModal({ machine, onClose, onStatusUpdate }: { machine: MachineItem, onClose: () => void, onStatusUpdate: () => void }) {
  if (!machine) return null;
  const styles = getStatusColor(machine.status);

  const handleCreateWorkOrder = () => {
    // 1. Create Work Order
    const newOrder = {
      id: `WO-${Math.floor(Math.random() * 9000) + 1000}`,
      machineId: machine.id,
      machineName: machine.name,
      issue: machine.prediction,
      priority: machine.status === 'CRITICAL' ? 'High' : 'Medium',
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    // 2. Save to Storage
    const existingOrders = JSON.parse(localStorage.getItem('pendingWorkOrders') || '[]');
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem('pendingWorkOrders', JSON.stringify(updatedOrders));

    // 3. Alert & Refresh
    alert(`✅ Work Order Created: ${newOrder.id}`);
    onStatusUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-700">
        
        {/* Modal Header (Colored) */}
        <div className={`px-6 py-4 border-b flex justify-between items-center bg-slate-800/50 ${styles.border}`}>
            <div>
                <h2 className={`text-xl font-bold text-slate-100`}>{machine.name}</h2>
                <div className="text-sm text-slate-400 flex gap-2">ID: {machine.id} • Status: <span className={`font-bold ${styles.text}`}>{machine.status}</span></div>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-full text-slate-400 transition-colors">✕</button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
            <div className="md:col-span-1 space-y-6">
                <div className="flex flex-col items-center p-4 card rounded-xl border border-slate-700">
                    <span className="text-sm font-semibold text-slate-400 mb-2">Health Index</span>
                    <HealthGauge value={machine.health} size="lg" />
                </div>
                <div className="space-y-4">
                    <MetricBar label="Temp" value={machine.temp} max={120} unit="°C" />
                    <MetricBar label="Vibration" value={machine.vibration} max={10} unit="mm/s" />
                </div>
            </div>
            <div className="md:col-span-2 space-y-5">
                <div className={`p-4 rounded-xl border bg-slate-800/30 ${styles.border}`}>
                    <h3 className="font-bold text-slate-100 mb-1">AI Diagnostics</h3>
                    <p className={`font-medium text-sm mb-2 ${styles.text}`}>{machine.prediction}</p>
                    <p className="text-xs text-slate-400"><span className="font-semibold">Root Cause:</span> {machine.rootCause}</p>
                </div>
                <div className="card p-4 rounded-xl border border-slate-700">
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wide mb-3">Recommended Actions</h4>
                    <div className="space-y-2">
                        {machine.suggestedActions?.map((a, i) => (
                            <label key={i} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded cursor-pointer border border-transparent hover:border-slate-700">
                                <input type="checkbox" className="rounded text-cyan-500 focus:ring-cyan-500 h-4 w-4" />
                                <span className="text-sm text-slate-300">{a}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-700 flex justify-end gap-3 mt-auto">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-colors">Cancel</button>
            {machine.status === 'MAINTENANCE' ? (
                <div className="px-4 py-2 text-sm font-bold text-emerald-400 bg-emerald-950/30 rounded-lg border border-emerald-800 flex items-center gap-2">
                    <span>✓ Maintenance Active</span>
                </div>
            ) : (
                <button onClick={handleCreateWorkOrder} className="px-4 py-2 text-sm font-bold bg-cyan-600 text-slate-900 rounded-lg shadow hover:bg-cyan-500 transition-colors">Create Work Order</button>
            )}
        </div>
      </div>
    </div>
  );
}

// --- 4. MAIN CONTENT ---
function MachinesContent() {
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceIds, setMaintenanceIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedMachine, setSelectedMachine] = useState<MachineItem | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function loadData() {
      const apiData = await fetchMachines();
      
      // SYNC: Read Work Orders to update machine status
      const storedOrders = JSON.parse(localStorage.getItem('pendingWorkOrders') || '[]');
      const activeIds = new Set<string>(
        storedOrders
          .filter((w: any) => w.status !== 'Resolved')
          .map((w: any) => w.machineId)
      );
      
      setMaintenanceIds(activeIds);
      setMachines(apiData);
      setLoading(false);
    }
    loadData();
  }, [refreshTrigger]);

  const mergedMachines = useMemo(() => {
    return machines.map(m => {
        if (maintenanceIds.has(m.id)) {
            return {
                ...m,
                status: 'MAINTENANCE',
                prediction: '⚠️ Maintenance In Progress',
                rootCause: 'Technician dispatched via Work Order.'
            };
        }
        return m;
    });
  }, [machines, maintenanceIds]);

  const filteredMachines = useMemo(() => {
    let result = [...mergedMachines];
    if (filterStatus !== 'ALL') {
        result = result.filter(m => {
            if (filterStatus === 'NORMAL') return ['NORMAL', 'RUNNING'].includes(m.status);
            if (filterStatus === 'CRITICAL') return ['CRITICAL', 'STOPPED', 'FAILURE'].includes(m.status);
            if (filterStatus === 'MAINTENANCE') return m.status === 'MAINTENANCE';
            return m.status === filterStatus;
        });
    }
    result.sort((a, b) => sortOrder === 'asc' ? a.health - b.health : b.health - a.health);
    return result;
  }, [mergedMachines, filterStatus, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">Machine Status</h1>
            <div className="text-sm text-slate-400 mt-1">Showing {filteredMachines.length} units • Live Telemetry</div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <button onClick={() => setSortOrder(p => p === 'asc' ? 'desc' : 'asc')} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-700">
                Sort: {sortOrder === 'asc' ? 'Worst First' : 'Best First'}
             </button>
             <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-sm">
                {['ALL', 'NORMAL', 'WARNING', 'CRITICAL', 'MAINTENANCE'].map(status => (
                    <button key={status} onClick={() => setFilterStatus(status)} 
                        className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase ${filterStatus === status ? 'bg-cyan-600 text-slate-900' : 'text-slate-400 hover:text-slate-300'}`}>
                        {status === 'MAINTENANCE' ? 'MAINT' : status}
                    </button>
                ))}
             </div>
          </div>
        </div>

        {loading ? <div className="flex justify-center h-64 text-slate-500">Loading live telemetry...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMachines.map((m) => {
                const styles = getStatusColor(m.status);
                
                // DYNAMIC CLASS Construction for Colored Cards
                return (
                <div 
                    key={m.id} 
                    onClick={() => setSelectedMachine(m)} 
                    className={`relative rounded-xl border p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 
                        ${styles.cardBg} ${styles.border} ${m.status === 'CRITICAL' ? 'ring-1 ring-red-300' : ''}`}
                >
                    <div className="flex justify-between items-start mb-4 gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-mono text-slate-500 mb-0.5">{m.id}</div>
                            <div className="font-bold text-slate-100 text-base leading-snug break-words">{m.name}</div>
                            
                            {/* Status Badge */}
                            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles.badge} ${styles.text} ${styles.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}></span>{m.status}
                            </div>
                        </div>
                        <HealthGauge value={m.health} />
                    </div>

                    {/* Insight Box (Semi-transparent white) */}
                    <div className="mb-4 px-3 py-2 rounded-lg text-xs border bg-slate-700/30 border-slate-700">
                        <span className={`font-bold opacity-90 mr-1 ${styles.text}`}>STATUS:</span>
                        <span className="text-slate-300">{m.prediction}</span>
                    </div>
                    
                    <MetricBar label="Temp" value={m.temp} max={120} unit="°C" />
                    <MetricBar label="Vib" value={m.vibration} max={10} unit="mm/s" />
                    
                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
                        <LiveSparkline baseValue={m.vibration} variance={2} color={styles.text} />
                    </div>
                </div>
                );
            })}
          </div>
        )}
        
        {selectedMachine && (
            <MachineDetailsModal 
                machine={selectedMachine} 
                onClose={() => setSelectedMachine(null)} 
                onStatusUpdate={() => setRefreshTrigger(prev => prev + 1)} 
            />
        )}
      </div>
    </div>
  );
}

export default function MachinesPage() {
  return <RequireAuth><MachinesContent /></RequireAuth>;
}