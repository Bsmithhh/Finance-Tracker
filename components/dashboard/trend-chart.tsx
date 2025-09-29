'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendChartProps {
  data: { month: string; amount: number }[]
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ fill: '#8884d8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}