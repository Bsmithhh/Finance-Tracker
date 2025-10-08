'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Custom color palette for better visual hierarchy
// Used colors that are distinct enough for accessibility
const COLORS = {
  Food: '#8884d8',
  Transportation: '#82ca9d',
  Entertainment: '#ffc658',
  Utilities: '#ff7300',
  Shopping: '#00C49F',
  Healthcare: '#FFBB28',
  Other: '#FF8042'
}

interface ExpenseChartProps {
  data: { category: string; amount: number }[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  // Transform data and assign colors - fallback to "Other" for unknown categories
  const chartData = data.map(item => ({
    name: item.category,
    value: item.amount,
    color: COLORS[item.category as keyof typeof COLORS] || COLORS.Other
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name ?? ''} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}