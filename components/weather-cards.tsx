"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Gauge } from "lucide-react"
import { useWeatherStore } from "@/lib/store/weather-store"

export function WeatherCards() {
  const { formattedData } = useWeatherStore()

  if (!formattedData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      icon: Thermometer,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      label: "Temperature",
      value: `${formattedData.temperature}°C`,
      detail: `Feels like ${formattedData.feelsLike}°C`,
      detailBg: "bg-blue-50"
    },
    {
      icon: Droplets,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      label: "Humidity",
      value: `${formattedData.humidity}%`,
      detail: `Dew Point ${Math.round(formattedData.temperature - ((100 - formattedData.humidity) / 5))}°C`,
      detailBg: "bg-purple-50"
    },
    {
      icon: Wind,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      label: "Wind Speed",
      value: `${formattedData.windSpeed} km/h`,
      detail: `Direction ${formattedData.windDirection}`,
      detailBg: "bg-green-50"
    },
    {
      icon: Gauge,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      label: "Pressure",
      value: `${formattedData.pressure} hPa`,
      detail: `Trend ${formattedData.pressure > 1013 ? 'Rising' : formattedData.pressure < 1013 ? 'Falling' : 'Stable'}`,
      detailBg: "bg-orange-50"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.iconBg} p-3 rounded-full`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{card.label}</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {card.value}
                  </div>
                </div>
              </div>
              <div className={`${card.detailBg} p-3 rounded-lg`}>
                <div className="text-xs text-gray-600">
                  {card.detail}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

