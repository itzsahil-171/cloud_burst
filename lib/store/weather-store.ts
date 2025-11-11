"use client"

import { create } from "zustand"
import type { WeatherData, ForecastData, Location, RiskData, FormattedWeatherData } from "@/lib/types/weather"
import { weatherService } from "@/lib/services/weather-service"

interface WeatherStore {
  weatherData: WeatherData | null
  forecastData: ForecastData | null
  currentLocation: Location
  riskData: RiskData | null
  formattedData: FormattedWeatherData | null
  loading: boolean
  error: string | null
  apiSource: string
  
  setLocation: (location: Location) => void
  setWeatherData: (data: WeatherData) => void
  setForecastData: (data: ForecastData) => void
  setRiskData: (data: RiskData) => void
  setFormattedData: (data: FormattedWeatherData) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setApiSource: (source: string) => void
  
  fetchWeather: (query?: string) => Promise<void>
  calculateRisk: () => void
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weatherData: null,
  forecastData: null,
  currentLocation: { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
  riskData: null,
  formattedData: null,
  loading: false,
  error: null,
  apiSource: 'Open-Meteo (FREE)',

  setLocation: (location) => set({ currentLocation: location }),
  setWeatherData: (data) => {
    set({ weatherData: data })
    get().calculateRisk()
    const formatted = weatherService.formatWeatherData(data)
    set({ formattedData: formatted })
  },
  setForecastData: (data) => set({ forecastData: data }),
  setRiskData: (data) => set({ riskData: data }),
  setFormattedData: (data) => set({ formattedData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setApiSource: (source) => set({ apiSource: source }),

  fetchWeather: async (query?: string) => {
    set({ loading: true, error: null })
    try {
      let result: { weather: WeatherData; forecast: ForecastData }
      if (query) {
        const locationResult = await weatherService.getWeatherForLocation(query)
        set({ currentLocation: locationResult.location })
        result = { weather: locationResult.weather, forecast: locationResult.forecast }
        set({ apiSource: 'Open-Meteo (FREE)' })
      } else {
        const location = get().currentLocation
        try {
          result = await weatherService.fetchOpenMeteoData(location.lat, location.lng)
          set({ apiSource: 'Open-Meteo (FREE)' })
        } catch (error) {
          if (weatherService.hasApiKey()) {
            try {
              const owmResult = await weatherService.fetchOpenWeatherMapData(location.lat, location.lng)
              if (owmResult.forecast) {
                result = { weather: owmResult.weather, forecast: owmResult.forecast }
                set({ apiSource: 'OpenWeatherMap (Free Tier)' })
              } else {
                throw error
              }
            } catch (owmError) {
              throw error
            }
          } else {
            throw error
          }
        }
      }

      set({ weatherData: result.weather, forecastData: result.forecast })
      get().calculateRisk()
      const formatted = weatherService.formatWeatherData(result.weather)
      set({ formattedData: formatted })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch weather data' })
    } finally {
      set({ loading: false })
    }
  },

  calculateRisk: () => {
    const weatherData = get().weatherData
    if (weatherData) {
      const risk = weatherService.calculateCloudBurstRisk(weatherData)
      set({ riskData: risk })
    }
  },
}))

