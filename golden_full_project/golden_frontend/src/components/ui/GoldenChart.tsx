// src/components/ui/GoldenChart.tsx
import {
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface BarChartProps {
  labels: string[]
  data: number[]
  label?: string
  height?: number
  color?: string
}

export function BarChart({ labels, data, label = 'Données', height = 160, color = '#B87333' }: BarChartProps) {
  if (data.length === 0) return null

  const chartData = labels.map((l, i) => ({ name: l, [label]: data[i] }))

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  const textColor = isDark ? '#5A7AAA' : '#8B7355'
  const gridColor = isDark ? 'rgba(184,115,51,0.08)' : 'rgba(139,69,19,0.08)'
  const fillColor = `${color}44`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: isDark ? '#0F1628' : '#F0EAE0',
            border: `1px solid ${color}`,
            borderRadius: 6,
            fontSize: 11,
            color: textColor,
          }}
          cursor={{ fill: `${color}11` }}
        />
        <Bar dataKey={label} fill={fillColor} stroke={color} strokeWidth={1} radius={[2, 2, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  )
}

interface LineChartProps {
  labels: string[]
  datasets: { label: string; data: number[]; color: string }[]
  height?: number
}

export function LineChart({ labels, datasets, height = 160 }: LineChartProps) {
  const chartData = labels.map((l, i) => {
    const point: Record<string, string | number> = { name: l }
    datasets.forEach(d => { point[d.label] = d.data[i] ?? 0 })
    return point
  })

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  const textColor = isDark ? '#5A7AAA' : '#8B7355'
  const gridColor = isDark ? 'rgba(184,115,51,0.08)' : 'rgba(139,69,19,0.08)'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: isDark ? '#0F1628' : '#F0EAE0',
            border: '1px solid #B87333',
            borderRadius: 6,
            fontSize: 11,
            color: textColor,
          }}
        />
        {datasets.length > 1 && (
          <Legend wrapperStyle={{ fontSize: 10, color: textColor }} iconSize={12} />
        )}
        {datasets.map(d => (
          <Line
            key={d.label}
            type="monotone"
            dataKey={d.label}
            stroke={d.color}
            strokeWidth={1.5}
            dot={{ r: 3, fill: d.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  )
}
