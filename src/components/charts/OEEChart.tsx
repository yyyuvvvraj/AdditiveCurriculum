"use client";
import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Row = { label: string; oee: number; availability: number };

export default function OEEChart({ data }: { data?: Row[] }) {
  const sample = data ?? [
    { label: "Line 1", oee: 78, availability: 85 },
    { label: "Line 2", oee: 62, availability: 70 },
    { label: "Line 3", oee: 90, availability: 92 },
    { label: "Line 4", oee: 55, availability: 60 },
  ];

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={sample} margin={{ top: 8, left: 0, right: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12, fill: "#475569" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#475569" }} />
          <Tooltip wrapperStyle={{ borderRadius: 8, boxShadow: "0 6px 18px rgba(16,24,40,0.08)" }} />
          <Bar yAxisId="left" dataKey="oee" barSize={18} fill="#06b6d4" radius={[6, 6, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="availability" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
