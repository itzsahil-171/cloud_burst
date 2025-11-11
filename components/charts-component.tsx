"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import { CloudRain, Thermometer } from "lucide-react"
import { useWeatherStore } from "@/lib/store/weather-store"
import { useMemo } from "react"

export function ChartsComponent() {
  const { forecastData, weatherData } = useWeatherStore()

  const rainfallData = useMemo(() => {
    if (!forecastData) return []
    return forecastData.list.slice(0, 24).map((item, index) => ({
      hour: new Date(item.dt * 1000).getHours(),
      rainfall: item.rainfall || 0,
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }))
  }, [forecastData])

  const temperatureData = useMemo(() => {
    if (!forecastData) return []
    return forecastData.list.slice(0, 7).map((item) => ({
      date: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(item.main.temp),
      min: Math.round(item.main.temp_min ?? item.main.temp - 2),
      max: Math.round(item.main.temp_max ?? item.main.temp + 2)
    }))
  }, [forecastData])

  const getRainfallColor = (value: number) => {
    if (value > 20) return "#ef4444" // red
    if (value > 10) return "#f97316" // orange
    if (value > 5) return "#f59e0b" // yellow
    return "#22c55e" // green
  }

  if (rainfallData.length === 0 && temperatureData.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              24-Hour Rainfall Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading chart data...
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              7-Day Temperature Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center text-gray-500">
              Loading chart data...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rainfall Chart */}
      <Card className="shadow-lg animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <CloudRain className="h-5 w-5" />
            24-Hour Rainfall Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis label={{ value: 'mm/h', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', border: 'none', borderRadius: '8px' }}
                formatter={(value: number) => [`${value.toFixed(1)} mm/h`, 'Rainfall']}
              />
              <Bar dataKey="rainfall" radius={[4, 4, 0, 0]}>
                {rainfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRainfallColor(entry.rainfall)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Temperature Chart */}
      <Card className="shadow-lg animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            7-Day Temperature Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', border: 'none', borderRadius: '8px' }}
                formatter={(value: number) => [`${value}°C`, 'Temperature']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="max" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Max Temp"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="temp" 
                stroke="#f97316" 
                strokeWidth={2}
                name="Current"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="min" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Min Temp"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

