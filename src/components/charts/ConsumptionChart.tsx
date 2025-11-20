"use client";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

type Point = { ts: string; value: number };

export default function ConsumptionChart({ data }: { data?: Point[] }) {
  const sample = data ?? [
    { ts: "2025-11-10", value: 120 },
    { ts: "2025-11-11", value: 140 },
    { ts: "2025-11-12", value: 90 },
    { ts: "2025-11-13", value: 170 },
    { ts: "2025-11-14", value: 150 },
    { ts: "2025-11-15", value: 180 },
    { ts: "2025-11-16", value: 160 },
  ];

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sample} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6eef3" />
          <XAxis dataKey="ts" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#475569" }} />
          <Tooltip
            wrapperStyle={{ borderRadius: 8, boxShadow: "0 6px 18px rgba(16,24,40,0.08)" }}
            contentStyle={{ border: "none" }}
          />
          <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="url(#g1)" strokeWidth={2} />
          <Line type="monotone" dataKey="value" stroke="#06b6d4" dot={{ r: 2 }} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
