// src/components/ui/GoldenChart.tsx
import { useEffect, useRef } from 'react'

interface BarChartProps {
  labels: string[]
  data: number[]
  label?: string
  height?: number
  color?: string
}

export function BarChart({ labels, data, label = 'Données', height = 160, color = '#B87333' }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    import('chart.js').then(({ Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend }) => {
      Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

      if (chartRef.current) chartRef.current.destroy()

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      const textColor = isDark ? '#5A7AAA' : '#8B7355'
      const gridColor = isDark ? 'rgba(184,115,51,0.08)' : 'rgba(139,69,19,0.08)'

      chartRef.current = new Chart(canvasRef.current!, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label,
            data,
            backgroundColor: `${color}44`,
            borderColor: color,
            borderWidth: 1,
            borderRadius: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark ? '#0F1628' : '#F0EAE0',
              titleColor: color,
              bodyColor: textColor,
              borderColor: color,
              borderWidth: 1,
            }
          },
          scales: {
            x: {
              ticks: { color: textColor, font: { size: 10 } },
              grid: { color: gridColor },
            },
            y: {
              ticks: { color: textColor, font: { size: 10 } },
              grid: { color: gridColor },
            }
          }
        }
      })
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [labels, data, color])

  if (data.length === 0) return null

  return (
    <div style={{ height, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

interface LineChartProps {
  labels: string[]
  datasets: { label: string; data: number[]; color: string }[]
  height?: number
}

export function LineChart({ labels, datasets, height = 160 }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<any>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    import('chart.js').then(({ Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler }) => {
      Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler)

      if (chartRef.current) chartRef.current.destroy()

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
      const textColor = isDark ? '#5A7AAA' : '#8B7355'
      const gridColor = isDark ? 'rgba(184,115,51,0.08)' : 'rgba(139,69,19,0.08)'

      chartRef.current = new Chart(canvasRef.current!, {
        type: 'line',
        data: {
          labels,
          datasets: datasets.map(d => ({
            label: d.label,
            data: d.data,
            borderColor: d.color,
            backgroundColor: `${d.color}11`,
            borderWidth: 1.5,
            pointRadius: 3,
            pointBackgroundColor: d.color,
            tension: 0.4,
            fill: true,
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: datasets.length > 1,
              labels: { color: textColor, font: { size: 10 }, boxWidth: 12 }
            },
            tooltip: {
              backgroundColor: isDark ? '#0F1628' : '#F0EAE0',
              titleColor: '#B87333',
              bodyColor: textColor,
              borderColor: '#B87333',
              borderWidth: 1,
            }
          },
          scales: {
            x: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } },
            y: { ticks: { color: textColor, font: { size: 10 } }, grid: { color: gridColor } }
          }
        }
      })
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [labels, datasets])

  return (
    <div style={{ height, position: 'relative' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
