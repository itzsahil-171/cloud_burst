"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp } from "lucide-react"
import { useWeatherStore } from "@/lib/store/weather-store"
import { cn } from "@/lib/utils"

export function RiskAssessment() {
  const { riskData, weatherData } = useWeatherStore()

  if (!riskData || !weatherData) return null

  const riskColor = {
    CRITICAL: "text-red-600 bg-red-100",
    HIGH: "text-orange-600 bg-orange-100",
    MEDIUM: "text-yellow-600 bg-yellow-100",
    LOW: "text-green-600 bg-green-100",
    MINIMAL: "text-blue-600 bg-blue-100"
  }[riskData.level] || "text-gray-600 bg-gray-100"

  const getRiskGradient = (score: number) => {
    if (score >= 75) return "from-red-500 to-red-700"
    if (score >= 55) return "from-orange-500 to-orange-700"
    if (score >= 35) return "from-yellow-500 to-yellow-700"
    return "from-green-500 to-green-700"
  }

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (riskData.score / 100) * circumference

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 shadow-lg animate-fade-in">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
          <Brain className="text-purple-600 h-8 w-8" />
          AI-Powered Risk Analysis
        </h3>
        <p className="text-gray-600 text-lg">
          Real-time cloud burst probability assessment based on multiple meteorological parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Meter */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-4 relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={cn("transition-all duration-500", {
                      "text-red-500": riskData.score >= 75,
                      "text-orange-500": riskData.score >= 55 && riskData.score < 75,
                      "text-yellow-500": riskData.score >= 35 && riskData.score < 55,
                      "text-green-500": riskData.score < 35
                    })}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{riskData.score}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Current Risk Level</h4>
              <div className={cn("px-4 py-2 rounded-full font-semibold inline-block", riskColor)}>
                {riskData.level} RISK
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Precipitation Rate</span>
              <span className={cn("font-semibold", {
                "text-red-600": (weatherData.rainfall || 0) > 20,
                "text-orange-600": (weatherData.rainfall || 0) > 10 && (weatherData.rainfall || 0) <= 20,
                "text-yellow-600": (weatherData.rainfall || 0) > 5 && (weatherData.rainfall || 0) <= 10,
                "text-blue-600": (weatherData.rainfall || 0) <= 5
              })}>
                {(weatherData.rainfall || 0).toFixed(1)} mm/h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Convective Energy</span>
              <span className={cn("font-semibold", {
                "text-red-600": weatherData.main.temp > 40,
                "text-orange-600": weatherData.main.temp > 35 && weatherData.main.temp <= 40,
                "text-purple-600": weatherData.main.temp <= 35
              })}>
                {weatherData.main.temp > 40 ? "Very High" :
                 weatherData.main.temp > 35 ? "High" :
                 weatherData.main.temp > 30 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Wind Shear</span>
              <span className={cn("font-semibold", {
                "text-red-600": (weatherData.wind?.speed || 0) / 3.6 > 15,
                "text-yellow-600": (weatherData.wind?.speed || 0) / 3.6 > 8 && (weatherData.wind?.speed || 0) / 3.6 <= 15,
                "text-green-600": (weatherData.wind?.speed || 0) / 3.6 <= 8
              })}>
                {(weatherData.wind?.speed || 0) / 3.6 > 20 ? "High" :
                 (weatherData.wind?.speed || 0) / 3.6 > 10 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Atmospheric Stability</span>
              <span className={cn("font-semibold", {
                "text-red-600": weatherData.main.pressure < 1005,
                "text-orange-600": weatherData.main.pressure >= 1005 && weatherData.main.pressure < 1010,
                "text-green-600": weatherData.main.pressure >= 1010
              })}>
                {weatherData.main.pressure < 995 ? "Very Unstable" :
                 weatherData.main.pressure < 1005 ? "Unstable" :
                 weatherData.main.pressure < 1015 ? "Neutral" :
                 weatherData.main.pressure < 1025 ? "Stable" : "Very Stable"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {riskData.factors.map((factor, index) => (
                <div key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

