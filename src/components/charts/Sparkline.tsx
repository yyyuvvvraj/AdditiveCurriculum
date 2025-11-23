// src/components/charts/Sparkline.tsx
"use client";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Area,
  CartesianGrid,
  XAxis,
} from "recharts";

export type Point = { date: string; value: number };

export default function Sparkline({ data, height = 72 }: { data: Point[]; height?: number }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[72px] flex items-center justify-center text-xs text-slate-400">
        No data
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }} className="overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="date" hide axisLine={false} />
          <Tooltip formatter={(v: any) => [v, "Value"]} labelFormatter={(l) => `${l}`} />
          <Area dataKey="value" stroke="transparent" fill="url(#g1)" />
          <Line dataKey="value" stroke="#7c3aed" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
