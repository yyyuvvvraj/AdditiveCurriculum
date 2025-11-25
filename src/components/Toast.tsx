// src/components/Toast.tsx
"use client";

import React, { useEffect } from "react";

export default function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: "var(--success)",
    error: "var(--danger)",
    info: "var(--muted-surface)",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="px-4 py-2 rounded-lg text-white shadow-lg" style={{ background: colors[type] }}>
        {message}
      </div>
    </div>
  );
}
