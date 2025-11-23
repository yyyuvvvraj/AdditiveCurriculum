// src/app/inventory/page.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import RequireAuth from "@/components/RequireAuth";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import { fetchInventory, addInventoryItem, InventoryItem } from "@/lib/api";

// ==========================================
// 1. HELPER COMPONENTS
// ==========================================

function InventoryKPI({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</div>
        <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      </div>
    </div>
  );
}

function StockLevelBar({ current, max }: { current: number, max: number }) {
  const percentage = Math.min((current / (max * 2)) * 100, 100); 
  const isCritical = current <= max / 2;
  const isLow = current <= max;
  let color = "bg-emerald-500";
  if (isCritical) color = "bg-red-500";
  else if (isLow) color = "bg-amber-500";

  return (
    <div className="w-24">
      <div className="flex justify-between text-[10px] mb-1 font-medium">
        <span className={isLow ? "text-red-600" : "text-slate-600"}>{current}</span>
        <span className="text-slate-400">ROP: {max}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function Pagination({ current, total, onChange }: { current: number, total: number, onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        if (current <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', total);
        } else if (current >= total - 3) {
            pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
        } else {
            pages.push(1, '...', current - 1, current, current + 1, '...', total);
        }
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-2">
        <button 
            onClick={() => onChange(Math.max(1, current - 1))}
            disabled={current === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all"
        >
            Prev
        </button>
        
        {getPages().map((p, i) => (
            <button
                key={i}
                onClick={() => typeof p === 'number' && onChange(p)}
                disabled={typeof p !== 'number'}
                className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-all ${
                    p === current 
                        ? 'bg-indigo-600 text-white shadow-md scale-105' 
                        : typeof p === 'number' 
                            ? 'bg-white border hover:bg-slate-50 text-slate-600' 
                            : 'text-slate-400 cursor-default'
                }`}
            >
                {p}
            </button>
        ))}

        <button 
            onClick={() => onChange(Math.min(total, current + 1))}
            disabled={current === total}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50 hover:bg-slate-50 text-slate-600 text-sm font-medium transition-all"
        >
            Next
        </button>
    </div>
  );
}

// ==========================================
// 2. MAIN CONTENT COMPONENT
// ==========================================

function InventoryContent() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Filters
  const [q, setQ] = useState("");
  const [filterLow, setFilterLow] = useState(false);
  const [category, setCategory] = useState("All Categories");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Modals
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const [reorderQty, setReorderQty] = useState<number>(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New Item State
  const [newItem, setNewItem] = useState({ name: "", category: "Mechanical", stock: 0, rop: 0, vendor: "", leadTime: 0 });
  const [toast, setToast] = useState<{ msg: string; type: any } | null>(null);

  // Load Data
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchInventory();
        if (isMounted) {
          setItems(data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Failed to load inventory", e);
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [refreshKey]);

  // Reset Page on Filter Change
  useEffect(() => { setCurrentPage(1); }, [q, filterLow, category]);

  // Process Data
  const categories = useMemo(() => ["All Categories", ...Array.from(new Set(items.map(i => i.category)))], [items]);

  const filtered = useMemo(() => {
    return items.filter(it => {
      if (filterLow && it.stock > it.rop) return false;
      if (category !== "All Categories" && it.category !== category) return false;
      if (!q) return true;
      const search = q.toLowerCase();
      return it.name.toLowerCase().includes(search) || it.id.toLowerCase().includes(search);
    });
  }, [items, q, filterLow, category]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const lowStockCount = items.filter(i => i.stock <= i.rop).length;
  const criticalCount = items.filter(i => i.stock === 0).length;

  // Handlers
  function handleAddItemSubmit() {
      if (!newItem.name || !newItem.vendor) return alert("Please fill in Name and Vendor");
      
      const item: InventoryItem = {
          id: `SP-${Math.floor(Math.random() * 9000) + 1000}`,
          name: newItem.name,
          category: newItem.category,
          stock: newItem.stock,
          rop: newItem.rop,
          status: newItem.stock <= newItem.rop ? 'Critical' : 'Normal',
          vendor: newItem.vendor,
          leadTime: newItem.leadTime
      };

      addInventoryItem(item);
      setRefreshKey(k => k + 1); 
      setIsAddOpen(false);
      setToast({ msg: `Added ${item.name} successfully!`, type: "success" });
      setNewItem({ name: "", category: "Mechanical", stock: 0, rop: 0, vendor: "", leadTime: 0 });
  }

  function handleCreateRequest() {
    if (!reorderItem) return;
    setToast({ msg: `Purchase Request Created: ${reorderQty} × ${reorderItem.name}`, type: "success" });
    setReorderItem(null);
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Inventory Management</h1>
          <div className="text-sm text-slate-500 mt-1">Real-time tracking across all plant locations</div>
        </div>

        {/* KPI DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <InventoryKPI title="Total SKUs" value={items.length} color="bg-indigo-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>} />
          <InventoryKPI title="Low Stock Alerts" value={lowStockCount} color="bg-amber-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>} />
          <InventoryKPI title="Stockouts" value={criticalCount} color="bg-red-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>} />
          <InventoryKPI title="Categories" value={categories.length - 1} color="bg-emerald-500" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>} />
        </div>

        {/* CONTROLS BAR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search parts..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button onClick={() => setFilterLow(!filterLow)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${filterLow ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              {filterLow ? <><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Low Stock Only</> : 'Show Low Stock'}
            </button>
            <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow hover:bg-indigo-700 transition-colors">
              + Add Item
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex justify-center items-center text-slate-400">Loading inventory...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Part Details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status / Level</th>
                      <th className="px-6 py-4">Supplier</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{item.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">{item.category}</span>
                        </td>
                        <td className="px-6 py-4">
                          <StockLevelBar current={item.stock} max={item.rop} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-700 font-medium">{item.vendor}</div>
                          <div className="text-xs text-slate-400">{item.leadTime} day lead</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => { setReorderItem(item); setReorderQty(Math.max(item.rop*2, item.stock+item.rop)); }} className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-all opacity-0 group-hover:opacity-100">
                            Reorder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION FOOTER */}
              {filtered.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="text-sm text-slate-500">
                    Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of {filtered.length} items
                  </div>
                  <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* MODAL: ADD ITEM */}
      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Inventory Item">
          <div className="space-y-4">
              <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Part Name</label>
                  <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Ball Bearing" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                      <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300">
                          {['Mechanical', 'Electrical', 'Consumables', 'Tooling'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vendor</label>
                      <input value={newItem.vendor} onChange={e => setNewItem({...newItem, vendor: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. Bosch" />
                  </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Stock</label>
                      <input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reorder Point</label>
                      <input type="number" value={newItem.rop} onChange={e => setNewItem({...newItem, rop: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lead Time (Days)</label>
                      <input type="number" value={newItem.leadTime} onChange={e => setNewItem({...newItem, leadTime: Number(e.target.value)})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
                  </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                  <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                  <button onClick={handleAddItemSubmit} className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Add Item</button>
              </div>
          </div>
      </Modal>

      {/* MODAL: REORDER */}
      <Modal open={!!reorderItem} onClose={() => setReorderItem(null)} title="Create Purchase Request">
        {reorderItem && (
          <div className="space-y-4">
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
               <div className="font-bold text-slate-800 text-lg">{reorderItem.name}</div>
               <div className="flex justify-between mt-1 text-sm">
                 <span className="text-slate-500">Stock: <span className="font-bold text-slate-700">{reorderItem.stock}</span></span>
                 <span className="text-slate-500">ROP: <span className="font-bold text-slate-700">{reorderItem.rop}</span></span>
               </div>
             </div>
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantity</label>
               <input type="number" value={reorderQty} onChange={e => setReorderQty(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800" />
             </div>
             <div className="flex justify-end gap-2 pt-2">
               <button onClick={() => setReorderItem(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
               <button onClick={handleCreateRequest} className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700">Confirm</button>
             </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ==========================================
// 3. PAGE EXPORT
// ==========================================

export default function InventoryPage() {
  return (
    <RequireAuth>
      <InventoryContent />
    </RequireAuth>
  );
}