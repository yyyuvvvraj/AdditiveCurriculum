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
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-slate-700",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`px-4 py-2 rounded-lg text-white shadow-lg ${colors[type]}`}
      >
        {message}
      </div>
    </div>
  );
}
