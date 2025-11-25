// src/components/AdminContent.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { fetchMachines, fetchInventory, updateMachineStatus, MachineItem, InventoryItem } from "@/lib/api";

// --- TYPES ---
type WorkOrder = {
  id: string;
  machineId?: string;
  machineName: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
  timestamp: string;
  status: "Pending" | "In Progress" | "Resolved";
};

type PurchaseOrder = {
  id: string;
  partName: string;
  vendor: string;
  qty: number;
  cost: number;
  status: 'Request' | 'Ordered' | 'In Transit' | 'Received';
  urgency: 'Normal' | 'Urgent';
};

// --- MOCK INITIAL DATA ---
const INITIAL_WORK_ORDERS: WorkOrder[] = [
  { id: "WO-101", machineId: "MC-1000", machineName: "Hydraulic Press 500T", issue: "Hydraulic Pump Failure", priority: "High", timestamp: new Date(Date.now() - 10000000).toISOString(), status: "In Progress" },
  { id: "WO-102", machineId: "MC-1002", machineName: "CNC Turning Center #1", issue: "Routine Maintenance", priority: "Low", timestamp: new Date(Date.now() - 5000000).toISOString(), status: "Pending" },
];

const INITIAL_POS: PurchaseOrder[] = [
  { id: "PO-881", partName: "Ball Bearing Set", vendor: "SKF", qty: 50, cost: 12000, status: "In Transit", urgency: "Urgent" },
  { id: "PO-882", partName: "Hydraulic Fluid (20L)", vendor: "Castrol", qty: 10, cost: 45000, status: "Ordered", urgency: "Normal" },
  { id: "PO-883", partName: "Servo Driver Unit", vendor: "Siemens", qty: 2, cost: 150000, status: "Request", urgency: "Urgent" },
];

// --- VISUAL: PROCUREMENT STAT CARD ---
function ProcStat({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) {
    return (
        <div className="card p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm`} style={{ background: color }}>
                {icon}
            </div>
            <div>
                <div className="text-xs font-bold uppercase tracking-wider muted">{label}</div>
                <div className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>{value}</div>
            </div>
        </div>
    );
}

// --- VISUAL: KANBAN CARD ---
function KanbanCard({ po, onMove }: { po: PurchaseOrder, onMove: (id: string, next: PurchaseOrder['status']) => void }) {
  const nextStatus: Record<string, PurchaseOrder['status']> = {
    'Request': 'Ordered',
    'Ordered': 'In Transit',
    'In Transit': 'Received',
    'Received': 'Received'
  };

  const isUrgent = po.urgency === 'Urgent';

  return (
        <div className={`group card p-4 mb-3 relative overflow-hidden`} style={{ borderLeft: isUrgent ? '4px solid var(--danger)' : '4px solid rgba(255,255,255,0.02)' }}>
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold tracking-mono text-slate-400">{po.id}</span>
        {isUrgent && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase" style={{ background: 'rgba(248,113,113,0.06)', color: 'var(--danger)', border: '1px solid rgba(248,113,113,0.12)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--danger)' }}></span> Urgent
            </span>
        )}
      </div>
      
            <h4 className="font-bold text-sm leading-tight text-slate-100" style={{ color: 'var(--text)' }}>{po.partName}</h4>
            <div className="text-xs mt-1 flex justify-between items-center">
                <span className="font-medium text-slate-400 muted">{po.vendor}</span>
                <span className="px-1.5 py-0.5 rounded font-mono bg-slate-700/50 text-slate-300" style={{ background: 'var(--muted-surface)', color: 'var(--muted)' }}>Qty: {po.qty}</span>
            </div>
      
      <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between items-center">
        <span className="font-mono text-xs font-bold text-slate-100" style={{ color: 'var(--text)' }}>₹{po.cost.toLocaleString()}</span>
        {po.status !== 'Received' && (
            <button 
            onClick={() => onMove(po.id, nextStatus[po.status])}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-[10px] font-bold uppercase btn primary"
            >
            Next <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        )}
        {po.status === 'Received' && (
            <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: 'var(--success)' }}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Done
            </span>
        )}
      </div>
    </div>
  );
}

// --- COMPONENT: FLEET HEALTH DONUT ---
function FleetHealthDonut({ machines }: { machines: MachineItem[] }) {
    const stats = useMemo(() => {
        const critical = machines.filter(m => m.status === 'CRITICAL').length;
        const warning = machines.filter(m => m.status === 'WARNING').length;
        const normal = machines.filter(m => m.status === 'NORMAL' || m.status === 'RUNNING').length;
        return { critical, warning, normal, total: machines.length };
    }, [machines]);

    if (stats.total === 0) return <div className="h-40 flex items-center justify-center text-slate-400">Loading...</div>;

    const radius = 40;
    const circ = 2 * Math.PI * radius;
    
    return (
        <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r={radius} stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                    <circle cx="64" cy="64" r={radius} stroke="#10b981" strokeWidth="12" fill="transparent" 
                        strokeDasharray={circ} strokeDashoffset={circ - (stats.normal/stats.total)*circ} className="transition-all duration-1000" />
                     <circle cx="64" cy="64" r={radius} stroke="#ef4444" strokeWidth="12" fill="transparent" 
                        strokeDasharray={circ} strokeDashoffset={circ - (stats.critical/stats.total)*circ} className="opacity-80 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{Math.round((stats.normal/stats.total)*100)}%</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Healthy</span>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-slate-600">Operational: <b>{stats.normal}</b></span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="text-slate-600">Warning: <b>{stats.warning}</b></span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span><span className="text-slate-600">Critical: <b>{stats.critical}</b></span></div>
            </div>
        </div>
    );
}

// --- COMPONENT: WORK ORDER ROW ---
function WorkOrderRow({ wo, onResolve }: { wo: WorkOrder, onResolve: (id: string, machineId?: string) => void }) {
    return (
        <div className="flex items-center justify-between p-4 card border border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all mb-3">
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${wo.priority === 'High' ? 'bg-red-950/30 text-red-400 border border-red-900' : 'bg-blue-950/30 text-blue-400 border border-blue-900'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                </div>
                <div>
                    <div className="font-bold text-slate-100">{wo.machineName}</div>
                    <div className="text-xs text-slate-400">Issue: <span className="font-medium text-slate-300">{wo.issue}</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">{new Date(wo.timestamp).toLocaleString()}</div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${wo.status === 'Pending' ? 'bg-amber-950/30 text-amber-400 border-amber-900' : 'bg-cyan-950/30 text-cyan-400 border-cyan-900'}`}>{wo.status}</span>
                {wo.status !== 'Resolved' && (
                    <button onClick={() => onResolve(wo.id, wo.machineId)} className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-slate-900 rounded-lg shadow hover:bg-emerald-500 transition-colors">Complete</button>
                )}
            </div>
        </div>
    );
}

// --- MAIN ADMIN COMPONENT ---
export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'procurement'>('overview');
  const [machines, setMachines] = useState<MachineItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  
  // CHANGED: Initialize with INITIAL_POS, don't load from local storage immediately to prevent stale data persistence across sessions if that's what you want.
  // If you want per-session persistence, use sessionStorage.
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [newPO, setNewPO] = useState<{partId: string, qty: number, urgency: 'Normal' | 'Urgent'}>({partId: '', qty: 10, urgency: 'Normal'});

  useEffect(() => {
    fetchMachines().then(setMachines);
    fetchInventory().then(setInventory);
    
    // Work Orders (Keep persistent for now)
    const storedWO = localStorage.getItem('pendingWorkOrders');
    if (storedWO) {
        try {
            const parsed: WorkOrder[] = JSON.parse(storedWO);
            setWorkOrders(prev => {
                const combined = [...parsed, ...prev];
                return Array.from(new Map(combined.map(item => [item.id, item])).values());
            });
        } catch (e) { console.error(e); }
    }

    // PURCHASE ORDERS: Use Session Storage so it clears on browser close/new tab
    // Or just use INITIAL_POS if you want it reset on every refresh
    const sessionPOs = sessionStorage.getItem('sessionPurchaseOrders');
    if (sessionPOs) {
        setPurchaseOrders(JSON.parse(sessionPOs));
    } else {
        setPurchaseOrders(INITIAL_POS);
    }
  }, []);

  const activeAlerts = machines.filter(m => m.status === 'CRITICAL').length;
  const lowStockItems = inventory.filter(i => i.status === 'Critical').length;
  const pendingPOs = purchaseOrders.filter(p => p.status !== 'Received').length;
  const totalPOValue = purchaseOrders.reduce((acc, p) => acc + p.cost, 0);

  const handleResolveWO = async (id: string, machineId?: string) => {
    const updatedWOs = workOrders.map(wo => wo.id === id ? { ...wo, status: 'Resolved' as const } : wo);
    setWorkOrders(updatedWOs);
    localStorage.setItem('pendingWorkOrders', JSON.stringify(updatedWOs));

    if (machineId) {
        await updateMachineStatus(machineId, 'NORMAL', 'Optimal Performance');
        const refreshedMachines = await fetchMachines();
        setMachines(refreshedMachines);
        alert("✅ Maintenance Completed. Machine status reset to Normal.");
    }
  };

  const handleMovePO = (id: string, nextStatus: PurchaseOrder['status']) => {
      const updated = purchaseOrders.map(p => p.id === id ? { ...p, status: nextStatus } : p);
      setPurchaseOrders(updated);
      // SAVE TO SESSION STORAGE ONLY
      sessionStorage.setItem('sessionPurchaseOrders', JSON.stringify(updated));
  };

  const handleCreatePO = () => {
      if(!newPO.partId) return;
      const part = inventory.find(i => i.id === newPO.partId);
      if(!part) return;

      const po: PurchaseOrder = {
          id: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
          partName: part.name,
          vendor: part.vendor,
          qty: newPO.qty,
          cost: Math.floor(Math.random() * 5000) + 1000,
          status: 'Request',
          urgency: newPO.urgency
      };

      const updated = [...purchaseOrders, po];
      setPurchaseOrders(updated);
      sessionStorage.setItem('sessionPurchaseOrders', JSON.stringify(updated));
      setIsPOModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-100">Plant Command Center</h1>
                <div className="text-sm text-slate-400 mt-1">
                    {activeTab === 'overview' ? 'Monitoring 50 active units' : 'Supply Chain Pipeline Management'}
                </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-sm self-start">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'overview' ? 'bg-slate-700 text-slate-100 shadow' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    Operations
                </button>
                <button onClick={() => setActiveTab('procurement')} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'procurement' ? 'bg-cyan-600 text-slate-900 shadow' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    Procurement Board
                </button>
            </div>
        </div>

        {/* === VIEW 1: OPERATIONS === */}
        {activeTab === 'overview' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
                        <div><div className="text-sm text-slate-400 font-medium">Critical Alerts</div><div className="text-3xl font-extrabold text-red-400 mt-1">{activeAlerts}</div></div>
                        <div className="p-3 bg-red-950/30 text-red-400 rounded-xl border border-red-900"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>
                    </div>
                    <div className="card p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
                        <div><div className="text-sm text-slate-400 font-medium">Pending Work Orders</div><div className="text-3xl font-extrabold text-cyan-400 mt-1">{workOrders.filter(w => w.status !== 'Resolved').length}</div></div>
                        <div className="p-3 bg-cyan-950/30 text-cyan-400 rounded-xl border border-cyan-900"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>
                    </div>
                    <div className="card p-5 rounded-2xl border border-slate-700 flex items-center justify-between">
                        <div><div className="text-sm text-slate-400 font-medium">Low Stock Items</div><div className="text-3xl font-extrabold text-amber-400 mt-1">{lowStockItems}</div></div>
                        <div className="p-3 bg-amber-950/30 text-amber-400 rounded-xl border border-amber-900"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card p-4 rounded-2xl border border-slate-700">
                            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-cyan-500 rounded-full"></span> Live Work Order Queue</h2>
                            <div className="space-y-2">
                                {workOrders.filter(w => w.status !== 'Resolved').length === 0 ? <div className="text-center py-12 text-slate-500">No pending work orders.</div> : workOrders.filter(w => w.status !== 'Resolved').map((wo) => (<WorkOrderRow key={wo.id} wo={wo} onResolve={handleResolveWO} />))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="card p-5 rounded-2xl border border-slate-700 shadow-lg">
                            <h3 className="font-bold text-slate-100 mb-4">Fleet Health Matrix</h3>
                            <FleetHealthDonut machines={machines} />
                        </div>
                    </div>
                </div>
            </>
        )}

        {/* === VIEW 2: PROCUREMENT KANBAN (NEW) === */}
        {activeTab === 'procurement' && (
            <div>
                {/* PROCUREMENT STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <ProcStat label="Active Requests" value={pendingPOs} color="bg-blue-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>} />
                    <ProcStat label="Est. Spend" value={`₹${totalPOValue.toLocaleString()}`} color="bg-emerald-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
                    <div className="md:col-span-2 flex justify-end items-center">
                        <button onClick={() => setIsPOModalOpen(true)} className="px-6 py-3 bg-cyan-600 text-slate-900 text-sm font-bold rounded-xl shadow-lg hover:bg-cyan-500 transition-all hover:scale-[1.02] flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Create Purchase Order
                        </button>
                    </div>
                </div>

                {/* KANBAN BOARD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full min-h-[600px] overflow-x-auto pb-4">
                    {[
                        { id: 'Request', label: 'Draft Request', color: 'bg-slate-800/50 border-slate-700' },
                        { id: 'Ordered', label: 'Placed with Vendor', color: 'bg-slate-800/50 border-slate-700' },
                        { id: 'In Transit', label: 'Shipped / In Transit', color: 'bg-slate-800/50 border-slate-700' },
                        { id: 'Received', label: 'Delivered & Stocked', color: 'bg-slate-800/50 border-slate-700' }
                    ].map((col) => (
                        <div key={col.id} className={`flex flex-col h-full rounded-2xl border ${col.color} p-4`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">{col.label}</h3>
                                <span className="bg-slate-700/50 text-slate-300 text-xs font-bold px-2 py-1 rounded-md border border-slate-700 shadow-sm">
                                    {purchaseOrders.filter(p => p.status === col.id).length}
                                </span>
                            </div>
                            
                            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                                {purchaseOrders.filter(p => p.status === col.id).map(po => (
                                    <KanbanCard key={po.id} po={po} onMove={handleMovePO} />
                                ))}
                                {purchaseOrders.filter(p => p.status === col.id).length === 0 && (
                                    <div className="h-32 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-xs text-slate-500 italic">
                                        No items
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* CREATE PO MODAL */}
      {isPOModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
              <div className="card rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-700">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                      <h2 className="text-xl font-bold text-slate-100">Create Purchase Order</h2>
                      <button onClick={() => setIsPOModalOpen(false)} className="text-slate-400 hover:text-slate-200">✕</button>
                  </div>
                  
                  <div className="space-y-5">
                      <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Part</label>
                          <select className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" onChange={(e) => setNewPO({...newPO, partId: e.target.value})}>
                              <option value="">-- Choose Part --</option>
                              {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.vendor})</option>)}
                          </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Quantity</label>
                              <input type="number" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none" value={newPO.qty} onChange={(e) => setNewPO({...newPO, qty: parseInt(e.target.value)})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Urgency</label>
                              <select className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none" value={newPO.urgency} onChange={(e) => setNewPO({...newPO, urgency: e.target.value as any})}>
                                  <option value="Normal">Normal</option>
                                  <option value="Urgent">Urgent</option>
                              </select>
                          </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                      <button onClick={() => setIsPOModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:bg-slate-700/50 rounded-xl transition-colors">Cancel</button>
                      <button onClick={handleCreatePO} className="px-5 py-2.5 text-sm font-bold bg-cyan-600 text-slate-900 rounded-xl shadow-lg hover:bg-cyan-500 transition-all active:scale-95">Submit Request</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}