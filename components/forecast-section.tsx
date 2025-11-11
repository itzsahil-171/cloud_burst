"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useWeatherStore } from "@/lib/store/weather-store"
import { CloudRain, Sun, Cloud } from "lucide-react"
import { cn } from "@/lib/utils"

export function ForecastSection() {
  const { forecastData, currentLocation } = useWeatherStore()

  if (!forecastData) return null

  const dailyForecast = forecastData.list
    .filter((_, index) => index % 8 === 0)
    .slice(0, 7)

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes("rain")) return CloudRain
    if (condition.toLowerCase().includes("clear") || condition.toLowerCase().includes("sun")) return Sun
    return Cloud
  }

  return (
    <section id="forecast" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            7-Day Weather Forecast
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extended weather outlook with cloud burst risk assessment
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <span className="text-gray-800 font-semibold">{currentLocation.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {dailyForecast.map((item, index) => {
            const Icon = getWeatherIcon(item.weather[0]?.main || "Clear")
            const date = new Date(item.dt * 1000)
            const isToday = index === 0

            return (
              <Card key={index} className={cn("hover:shadow-lg transition-all", isToday && "ring-2 ring-blue-500")}>
                <CardContent className="p-4 text-center">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    {isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="flex justify-center mb-3">
                    <Icon className={cn("h-8 w-8", {
                      "text-yellow-500": Icon === Sun,
                      "text-blue-500": Icon === CloudRain,
                      "text-gray-400": Icon === Cloud
                    })} />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">
                    {Math.round(item.main.temp)}°C
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {Math.round(item.main.temp_min ?? item.main.temp - 2)}° / {Math.round(item.main.temp_max ?? item.main.temp + 2)}°
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {item.weather[0]?.description || "Clear"}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
                    <CloudRain className="h-3 w-3" />
                    <span>{(item.rainfall || 0).toFixed(1)}mm</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {Math.round(item.pop * 100)}% chance
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

