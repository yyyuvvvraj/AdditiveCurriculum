// src/components/Modal.tsx
"use client";

import React from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal">
      <div className="card w-full max-w-md p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-muted text-xl leading-none">×</button>
        </div>

        {children}
      </div>
    </div>
  );
}
