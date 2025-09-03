"use client";

import React from "react";
import {
  BarChart as RBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RPieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

export function BarChart({
  data,
  xKey = "label",
  yKey = "value",
  height = 260,
  className,
}: {
  data: { [key: string]: any }[];
  xKey?: string;
  yKey?: string;
  height?: number;
  className?: string;
}) {
  console.log("BarChart received data:", data);
  if (!data || data.length === 0) {
    console.log("BarChart: Data is empty or null");
    return (
      <div className="text-center text-gray-500 py-4">No data available</div>
    );
  }
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RBarChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey={yKey} fill="#6366f1" radius={[4, 4, 0, 0]} />
        </RBarChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
];

export function PieChart({
  data,
  nameKey = "name",
  valueKey = "value",
  height = 260,
  className,
}: {
  data: { [key: string]: any }[];
  nameKey?: string;
  valueKey?: string;
  height?: number;
  className?: string;
}) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RPieChart>
          <Tooltip />
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </RPieChart>
      </ResponsiveContainer>
    </div>
  );
}
