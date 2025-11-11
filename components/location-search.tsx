"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Loader2 } from "lucide-react"
import { useWeatherStore } from "@/lib/store/weather-store"
import { useToast } from "@/hooks/use-toast"

export function LocationSearch() {
  const [query, setQuery] = useState("")
  const { fetchWeather, loading, apiSource } = useWeatherStore()
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        variant: "warning",
        title: "Please enter a location",
        description: "Enter a city name or coordinates to search",
      })
      return
    }

    try {
      await fetchWeather(query)
      toast({
        variant: "success",
        title: "Location updated",
        description: `Weather data loaded for ${query}`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to find location",
      })
    }
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        try {
          await fetchWeather(`${lat},${lng}`)
          toast({
            variant: "success",
            title: "Location detected",
            description: "Weather data updated for your location",
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Failed to fetch weather",
            description: "Could not get weather for your location",
          })
        }
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location access denied",
          description: "Please allow location access or search manually",
        })
      }
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <MapPin className="h-4 w-4" />
            <span className="font-semibold">Currently Using:</span>
            <span className="font-bold">{apiSource}</span>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Input
          type="text"
          placeholder="Enter city, state, or coordinates (e.g., Mumbai, Maharashtra)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pr-24 text-lg py-6"
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleGetCurrentLocation}
            className="h-10 w-10"
            title="Use current location"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="h-10 w-10"
            title="Search location"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

