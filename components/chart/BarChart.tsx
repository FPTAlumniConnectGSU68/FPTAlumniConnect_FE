"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  date: string;
  value: number;
};

interface DayBarChartProps {
  data: ChartData[];
  title?: string;
}

export default function DayBarChart({ data, title }: DayBarChartProps) {
  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            padding={{ left: 0, right: 0 }}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={30} // make the Y axis thinner
          />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
