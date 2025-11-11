"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Key, Info } from "lucide-react"
import { weatherService } from "@/lib/services/weather-service"
import { useWeatherStore } from "@/lib/store/weather-store"
import { useToast } from "@/hooks/use-toast"

export function ApiKeyConfig() {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("openweather_api_key") || ""
    }
    return ""
  })
  const { setApiSource, fetchWeather } = useWeatherStore()
  const { toast } = useToast()

  const handleSave = () => {
    if (apiKey.trim()) {
      weatherService.setAPIKey(apiKey.trim())
      setApiSource("OpenWeatherMap (Free Tier) + Open-Meteo (Fallback)")
      toast({
        variant: "success",
        title: "API key saved",
        description: "Using enhanced OpenWeatherMap features",
      })
      fetchWeather()
    } else {
      toast({
        variant: "warning",
        title: "Invalid key",
        description: "Please enter a valid API key",
      })
    }
  }

  const handleClear = () => {
    setApiKey("")
    weatherService.setAPIKey(null)
    setApiSource("Open-Meteo (FREE)")
    toast({
      variant: "info",
      title: "API key cleared",
      description: "Using free Open-Meteo API",
    })
    fetchWeather()
  }

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <details className="group">
          <summary className="cursor-pointer font-semibold text-green-800 flex items-center gap-2 list-none">
            <Key className="h-5 w-5" />
            <span>OpenWeatherMap API Key (Optional)</span>
          </summary>
          
          <div className="mt-4 space-y-3">

            <div>
              <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700 mb-2 block">
                Optional: OpenWeatherMap API Key (Free tier available - for enhanced features only)
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  (Get free key)
                </a>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Optional: Enter OpenWeatherMap API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSave} variant="default">
                  Save
                </Button>
                <Button onClick={handleClear} variant="outline">
                  Clear
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>
                  OpenWeatherMap API key provides additional features. Your key is stored locally in your browser.
                </span>
              </p>
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}

