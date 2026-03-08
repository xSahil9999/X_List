"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#0ea5e9", "#6366f1", "#f59e0b", "#f43f5e"];

export function StatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={95} label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#111827",
              borderColor: "#1f2937",
              color: "#fff",
              borderRadius: 10
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
