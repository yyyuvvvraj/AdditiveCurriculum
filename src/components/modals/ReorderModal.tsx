// src/components/modals/ReorderModal.tsx
"use client";
import React from "react";

type Item = {
  name: string;
};

type ReorderModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: Item | null;
};

export default function ReorderModal({ open, setOpen, item }: ReorderModalProps) {
  const [qty, setQty] = React.useState(10);

  // reset qty when modal opens
  React.useEffect(() => {
    if (open) setQty(10);
  }, [open]);

  if (!open || !item) return null;

  function handleCreate() {
    // simple feedback for now
    alert(`Purchase request created for ${qty} units of ${item.name}`);
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800">
            Reorder — {item.name}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-3">
          Enter the quantity to request. This is a mock action for the demo.
        </p>

        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg border mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-amber-400 text-slate-900 text-sm font-medium"
          >
            Create request
          </button>
        </div>
      </div>
    </div>
  );
}
