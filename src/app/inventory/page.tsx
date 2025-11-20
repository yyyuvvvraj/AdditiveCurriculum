// src/app/inventory/page.tsx
"use client";
import React, { useMemo, useState } from "react";
import RequireAuth from "@/components/RequireAuth";

type Item = { id: string; name: string; partNo: string; location: string; qty: number; reorderPoint: number; supplier?: string; leadDays?: number };

const demoItems: Item[] = [
  { id: "1", name: "Brake Pad - A", partNo: "BP-A-001", location: "Plant A", qty: 12, reorderPoint: 20, supplier: "ACME", leadDays: 5 },
  { id: "2", name: "Bolt M8", partNo: "BLT-M8", location: "Plant B", qty: 180, reorderPoint: 50, supplier: "Fasteners Ltd", leadDays: 7 },
  { id: "3", name: "Hydraulic Oil (20L)", partNo: "HO-20", location: "Store", qty: 3, reorderPoint: 5, supplier: "OilCo", leadDays: 2 },
  { id: "4", name: "Pad Shim", partNo: "PS-11", location: "Plant A", qty: 45, reorderPoint: 30, supplier: "Shims Inc", leadDays: 10 },
];

function QtyBadge({ qty, reorder }: { qty: number; reorder: number }) {
  if (qty <= reorder) {
    return <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 font-medium text-sm"> {qty} </span>;
  }
  if (qty <= reorder * 1.5) {
    return <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-medium text-sm"> {qty} </span>;
  }
  return <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium text-sm"> {qty} </span>;
}

function InventoryContent() {
  const [items] = useState<Item[]>(demoItems);
  const [q, setQ] = useState("");
  const [filterLow, setFilterLow] = useState(false);
  const [location, setLocation] = useState("all");

  const locations = useMemo(() => ["all", ...Array.from(new Set(items.map((i) => i.location)))] , [items]);

  const filtered = items.filter((it) => {
    if (filterLow && it.qty > it.reorderPoint) return false;
    if (location !== "all" && it.location !== location) return false;
    if (!q) return true;
    return it.name.toLowerCase().includes(q.toLowerCase()) || it.partNo.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Spare Parts Inventory</h1>
            <div className="text-sm text-slate-500">Critical spares & consumables — monitor, reorder, and forecast.</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search part or # (BP-A-001)"
                className="px-3 py-2 rounded-md border w-64 text-slate-700"
              />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="px-3 py-2 rounded-md border bg-white text-slate-700">
                {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <button onClick={() => setFilterLow((s) => !s)} className={`px-3 py-2 rounded-md border ${filterLow ? "bg-amber-100 border-amber-300" : ""}`}>
                Low stock
              </button>
            </div>

            <button className="px-4 py-2 rounded-lg bg-amber-400 text-white font-medium shadow">Add Item</button>
            <button className="px-4 py-2 rounded-lg border bg-white text-slate-700 shadow-sm">Import</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border shadow-lg overflow-x-auto">
          <table className="w-full table-auto min-w-[840px]">
            <thead className="text-left text-sm text-slate-700 border-b">
              <tr>
                <th className="px-4 py-3">Part</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Reorder</th>
                <th className="px-4 py-3">Lead (days)</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">ETA / Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((it) => {
                return (
                  <tr key={it.id} className={`hover:bg-slate-50`}>
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-900">{it.name}</div>
                      <div className="text-xs text-slate-500">{it.partNo}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{it.location}</td>
                    <td className="px-4 py-4">
                      <QtyBadge qty={it.qty} reorder={it.reorderPoint} />
                    </td>
                    <td className="px-4 py-4 text-slate-700">{it.reorderPoint}</td>
                    <td className="px-4 py-4 text-slate-700">{it.leadDays ?? "-"}</td>
                    <td className="px-4 py-4 text-slate-700">{it.supplier}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {/* clearer visible buttons */}
                        <button
                          onClick={() => {/* open adjust modal */}}
                          className="px-3 py-1 rounded border bg-white text-slate-700 shadow-sm hover:shadow-md text-sm"
                          aria-label={`Adjust ${it.name}`}
                        >
                          Adjust
                        </button>

                        <button
                          onClick={() => {/* reorder action */}}
                          className="px-3 py-1 rounded bg-amber-500 text-white font-medium shadow hover:shadow-md text-sm"
                          aria-label={`Reorder ${it.name}`}
                        >
                          Reorder
                        </button>

                        <button
                          onClick={() => {/* show ETA */}}
                          className="px-3 py-1 rounded border bg-white text-slate-700 shadow-sm hover:shadow-md text-sm"
                          aria-label={`ETA ${it.name}`}
                        >
                          ETA
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">No items match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-600">
          <div>Showing {filtered.length} of {items.length} items</div>
          <div>Tip: click <span className="font-medium">Reorder</span> to create a purchase suggestion</div>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <RequireAuth>
      <InventoryContent />
    </RequireAuth>
  );
}
