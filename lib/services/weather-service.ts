"use client"

import type { WeatherData, ForecastData, Location, RiskData, FormattedWeatherData } from "@/lib/types/weather"

type CacheData = WeatherData | { weather: WeatherData; forecast: ForecastData | null } | Location

const INDIAN_CITIES: Record<string, Location> = {
  'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
  'delhi': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, Delhi' },
  'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
  'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
  'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' },
  'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune, Maharashtra' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad, Gujarat' },
  'surat': { lat: 21.1702, lng: 72.8311, name: 'Surat, Gujarat' },
  'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur, Rajasthan' },
}

const CACHE_TIMEOUT = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: CacheData; timestamp: number }>()

export class AIService {
  private readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions'
  private readonly MODEL = 'openai/gpt-oss-20b'
  private apiKey: string | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || null
    }
  }

  async getCloudBurstInsights(weatherData: any, location: string): Promise<string> {
    if (!this.apiKey) {
      return "AI insights unavailable - Groq API key not configured"
    }

    const systemPrompt = `You are a weather analysis expert specializing in cloud burst prediction and risk assessment. Analyze the following weather data and provide actionable insights about cloud burst risks, safety recommendations, and weather patterns. 

IMPORTANT: Format your response using Markdown syntax. Use:
- Headers (##, ###) for sections
- Tables for structured data (use markdown table syntax)
- Bullet points (-) or numbered lists for recommendations
- **Bold** for emphasis on important terms
- *Italic* for technical terms

Weather Data:
- Location: ${location}
- Temperature: ${weatherData.main?.temp || 'N/A'}°C
- Humidity: ${weatherData.main?.humidity || 'N/A'}%
- Pressure: ${weatherData.main?.pressure || 'N/A'} hPa
- Wind Speed: ${weatherData.wind?.speed ? weatherData.wind.speed * 3.6 : 'N/A'} km/h
- Rainfall: ${weatherData.rainfall || 0} mm/h
- Weather Condition: ${weatherData.weather?.[0]?.description || 'N/A'}

Please provide in Markdown format:
1. ## Current risk assessment
2. ## Key weather patterns to watch (use a table if helpful)
3. ## Safety recommendations
4. ## Timeline for potential changes (use a table with columns: Time window, Expected changes, Actionable alert)`

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: "Please analyze this weather data for cloud burst risks and provide insights."
            }
          ],
          model: this.MODEL,
          temperature: 0.7,
          max_completion_tokens: 2048,
          top_p: 1,
          stream: false,
          reasoning_effort: "medium"
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || "Unable to generate AI insights at this time."

    } catch (error) {
      console.error('AI service error:', error)
      return "AI insights temporarily unavailable. Please check your connection and API key configuration."
    }
  }

  async getWeatherTrends(forecastData: any[], location: string): Promise<string> {
    if (!this.apiKey) {
      return "AI trends analysis unavailable - Groq API key not configured"
    }

    const forecastSummary = forecastData.slice(0, 5).map((item, index) =>
      `Day ${index + 1}: ${item.main?.temp}°C, ${item.rainfall || 0}mm rain, ${item.weather?.[0]?.description || 'N/A'}`
    ).join('\n')

    const systemPrompt = `You are a meteorological expert analyzing weather forecast data for cloud burst risk assessment. Provide a concise analysis of weather trends and potential cloud burst risks over the next 5 days.

Forecast Data for ${location}:
${forecastSummary}

Focus on (format in Markdown):
1. ## Weather pattern trends
2. ## Risk pattern analysis (increasing/decreasing)
3. ## Critical time periods to monitor
4. ## Overall risk trajectory`

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: "Analyze these weather trends for cloud burst risk assessment."
            }
          ],
          model: this.MODEL,
          temperature: 0.6,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false,
          reasoning_effort: "medium"
        })
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || "Unable to analyze weather trends at this time."

    } catch (error) {
      console.error('AI trends analysis error:', error)
      return "Weather trend analysis temporarily unavailable."
    }
  }
}

export const aiService = new AIService()

export class WeatherService {
  private apiKey: string | null = null
  private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5'
  private readonly GEOCODE_URL = 'https://api.openweathermap.org/geo/1.0'
  private readonly OPEN_METEO_URL = 'https://api.open-meteo.com/v1'

  constructor() {
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('openweather_api_key')
    }
  }

  hasApiKey(): boolean {
    return this.apiKey !== null && this.apiKey !== ''
  }

  setAPIKey(key: string | null) {
    this.apiKey = key
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('openweather_api_key', key)
      } else {
        localStorage.removeItem('openweather_api_key')
      }
    }
  }

  private async fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  async geocodeLocation(query: string): Promise<Location> {
    const cacheKey = `geocode_${query.toLowerCase()}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      return cached.data as Location
    }

    if (this.apiKey) {
      try {
        const url = `${this.GEOCODE_URL}/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`
        const response = await this.fetchWithTimeout(url, 5000)
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            const result: Location = {
              lat: data[0].lat,
              lng: data[0].lon,
              name: `${data[0].name}, ${data[0].country || 'India'}`
            }
            cache.set(cacheKey, { data: result, timestamp: Date.now() })
            return result
          }
        }
      } catch (error) {
        console.warn('OpenWeatherMap geocoding failed:', error)
      }
    }

    const normalizedQuery = query.toLowerCase().replace(/[^a-z]/g, '')
    for (const [key, location] of Object.entries(INDIAN_CITIES)) {
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        return location
      }
    }

    const coordMatch = query.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/)
    if (coordMatch) {
      return {
        lat: parseFloat(coordMatch[1]),
        lng: parseFloat(coordMatch[2]),
        name: query
      }
    }

    return { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' }
  }

  async fetchOpenMeteoData(lat: number, lng: number): Promise<{ weather: WeatherData; forecast: ForecastData }> {
    const url = `${this.OPEN_METEO_URL}/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,precipitation&hourly=precipitation,temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata`
    
    const response = await this.fetchWithTimeout(url, 5000)
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status}`)
    }

    const data = await response.json()
    const current = data.current

    const weatherData: WeatherData = {
      main: {
        temp: current.temperature_2m,
        feels_like: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl / 100
      },
      wind: {
        speed: current.wind_speed_10m * 3.6,
        deg: current.wind_direction_10m
      },
      weather: [{
        main: current.precipitation > 0 ? 'Rain' : 'Clear',
        description: current.precipitation > 0 ? 'rain' : 'clear sky',
        icon: current.precipitation > 0 ? '10d' : '01d'
      }],
      clouds: { all: current.relative_humidity_2m },
      visibility: 10000,
      dt: Math.floor(Date.now() / 1000),
      coord: { lat, lon: lng },
      name: await this.getCityNameFromCoords(lat, lng),
      rainfall: current.precipitation || 0
    }

    const forecast: ForecastData = {
      city: { name: weatherData.name, coord: { lat, lon: lng } },
      list: []
    }

    if (data.hourly && data.hourly.time) {
      for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
        forecast.list.push({
          dt: new Date(data.hourly.time[i]).getTime() / 1000,
          main: {
            temp: data.hourly.temperature_2m[i],
            temp_min: data.hourly.temperature_2m[i] - 2,
            temp_max: data.hourly.temperature_2m[i] + 2,
            humidity: data.hourly.relative_humidity_2m[i],
            pressure: current.pressure_msl / 100
          },
          weather: [{
            main: data.hourly.precipitation[i] > 0 ? 'Rain' : 'Clear',
            description: data.hourly.precipitation[i] > 0 ? 'rain' : 'clear sky',
            icon: data.hourly.precipitation[i] > 0 ? '10d' : '01d'
          }],
          wind: {
            speed: current.wind_speed_10m * 3.6,
            deg: current.wind_direction_10m
          },
          clouds: { all: data.hourly.relative_humidity_2m[i] },
          rainfall: data.hourly.precipitation[i] || 0,
          pop: data.hourly.precipitation[i] > 0 ? 0.8 : 0.1
        })
      }
    }

    return { weather: weatherData, forecast }
  }

  async fetchOpenWeatherMapData(lat: number, lng: number): Promise<{ weather: WeatherData; forecast: ForecastData | null }> {
    if (!this.apiKey) throw new Error('API key required')

    const cacheKey = `weather_${lat}_${lng}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TIMEOUT) {
      return cached.data as { weather: WeatherData; forecast: ForecastData | null }
    }

    const currentUrl = `${this.BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
    const currentResponse = await this.fetchWithTimeout(currentUrl, 5000)
    
    if (!currentResponse.ok) {
      if (currentResponse.status === 401) throw new Error('Invalid API key')
      throw new Error(`API error: ${currentResponse.status}`)
    }

    const currentData = await currentResponse.json()
    const rainfall = this.extractRainfall(currentData)

    const weatherData: WeatherData = {
      ...currentData,
      rainfall
    }

    let forecastData: ForecastData | null = null
    try {
      const forecastUrl = `${this.BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      const forecastResponse = await this.fetchWithTimeout(forecastUrl, 5000)
      if (forecastResponse.ok) {
        forecastData = await forecastResponse.json()
      }
    } catch (error) {
      console.warn('Forecast fetch failed:', error)
    }

    const result = { weather: weatherData, forecast: forecastData }
    cache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  }

  private extractRainfall(weatherData: WeatherData): number {
    if (weatherData.rain) {
      return weatherData.rain['1h'] || (weatherData.rain['3h'] ? weatherData.rain['3h'] / 3 : 0) || 0
    }
    if (weatherData.snow) {
      return (weatherData.snow['1h'] || (weatherData.snow['3h'] ? weatherData.snow['3h'] / 3 : 0) || 0) * 0.1
    }
    return 0
  }

  private async getCityNameFromCoords(lat: number, lng: number): Promise<string> {
    if (this.apiKey) {
      try {
        const url = `${this.GEOCODE_URL}/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${this.apiKey}`
        const response = await this.fetchWithTimeout(url, 3000)
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            return `${data[0].name}, ${data[0].country || 'India'}`
          }
        }
      } catch (error) {
        console.warn('Reverse geocoding failed:', error)
      }
    }

    let closestCity = Object.values(INDIAN_CITIES)[0]
    let minDistance = this.calculateDistance(lat, lng, closestCity.lat, closestCity.lng)

    for (const city of Object.values(INDIAN_CITIES)) {
      const distance = this.calculateDistance(lat, lng, city.lat, city.lng)
      if (distance < minDistance) {
        minDistance = distance
        closestCity = city
      }
    }

    return closestCity.name
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  async getWeatherForLocation(query: string): Promise<{ weather: WeatherData; forecast: ForecastData; location: Location }> {
    const location = await this.geocodeLocation(query)
    let result: { weather: WeatherData; forecast: ForecastData } | null = null

    try {
      result = await this.fetchOpenMeteoData(location.lat, location.lng)
    } catch (error) {
      console.warn('Open-Meteo failed, trying OpenWeatherMap:', error)
      if (this.apiKey) {
        try {
          const owmResult = await this.fetchOpenWeatherMapData(location.lat, location.lng)
          if (owmResult.forecast) {
            result = { weather: owmResult.weather, forecast: owmResult.forecast }
          }
        } catch (error2) {
          console.warn('OpenWeatherMap failed:', error2)
        }
      }
    }

    if (!result) {
      throw new Error('Failed to fetch weather data')
    }

    return { ...result, location }
  }

  calculateCloudBurstRisk(weatherData: WeatherData): RiskData {
    if (!weatherData || !weatherData.main) {
      return { score: 0, level: 'LOW', factors: ['Insufficient data'] }
    }

    let riskScore = 0
    const factors: string[] = []
    const warnings: string[] = []

    const rainfall = weatherData.rainfall || 0
    const humidity = weatherData.main.humidity || 0
    const pressure = weatherData.main.pressure || 1013
    const temp = weatherData.main.temp || 25
    const windSpeed = (weatherData.wind?.speed || 0) / 3.6
    const cloudCover = weatherData.clouds?.all || 0
    const weatherMain = weatherData.weather?.[0]?.main || ''
    const visibility = weatherData.visibility || 10000

    if (rainfall > 100) {
      riskScore += 50
      factors.push(`Extreme rainfall: ${rainfall.toFixed(1)}mm/h (Cloud Burst Level!)`)
      warnings.push('CRITICAL: Cloud burst conditions detected!')
    } else if (rainfall > 50) {
      riskScore += 40
      factors.push(`Very heavy rainfall: ${rainfall.toFixed(1)}mm/h`)
      warnings.push('WARNING: Approaching cloud burst threshold')
    } else if (rainfall > 20) {
      riskScore += 30
      factors.push(`Heavy rainfall: ${rainfall.toFixed(1)}mm/h`)
    } else if (rainfall > 10) {
      riskScore += 20
      factors.push(`Moderate rainfall: ${rainfall.toFixed(1)}mm/h`)
    } else if (rainfall > 5) {
      riskScore += 10
      factors.push(`Light rainfall: ${rainfall.toFixed(1)}mm/h`)
    }

    if (humidity > 90) {
      riskScore += 25
      factors.push(`Extremely high humidity: ${humidity}%`)
    } else if (humidity > 85) {
      riskScore += 20
      factors.push(`Very high humidity: ${humidity}%`)
    } else if (humidity > 70) {
      riskScore += 15
      factors.push(`High humidity: ${humidity}%`)
    } else if (humidity < 30) {
      riskScore -= 5
      factors.push(`Low humidity: ${humidity}% (reduces risk)`)
    }

    if (pressure < 995) {
      riskScore += 20
      factors.push(`Very low pressure: ${pressure.toFixed(1)}hPa (unstable)`)
    } else if (pressure < 1005) {
      riskScore += 15
      factors.push(`Low pressure: ${pressure.toFixed(1)}hPa`)
    } else if (pressure > 1025) {
      riskScore -= 5
      factors.push(`High pressure: ${pressure.toFixed(1)}hPa (stable)`)
    }

    if (temp > 40) {
      riskScore += 15
      factors.push(`Very high temperature: ${temp.toFixed(1)}°C (high convective energy)`)
    } else if (temp > 35) {
      riskScore += 10
      factors.push(`High temperature: ${temp.toFixed(1)}°C`)
    } else if (temp < 15) {
      riskScore -= 5
      factors.push(`Low temperature: ${temp.toFixed(1)}°C (reduces risk)`)
    }

    if (windSpeed > 20) {
      riskScore += 10
      factors.push(`Strong winds: ${windSpeed.toFixed(1)}m/s`)
    } else if (windSpeed > 10) {
      riskScore += 5
      factors.push(`Moderate winds: ${windSpeed.toFixed(1)}m/s`)
    }

    if (cloudCover > 90) {
      riskScore += 10
      factors.push(`Dense cloud cover: ${cloudCover}%`)
    } else if (cloudCover > 70) {
      riskScore += 5
      factors.push(`Heavy cloud cover: ${cloudCover}%`)
    }

    if (weatherMain === 'Thunderstorm') {
      riskScore += 15
      factors.push('Thunderstorm activity detected')
    } else if (weatherMain === 'Rain') {
      riskScore += 10
      factors.push('Active rainfall')
    }

    if (visibility < 1000) {
      riskScore += 10
      factors.push(`Very low visibility: ${visibility}m`)
    } else if (visibility < 5000) {
      riskScore += 5
      factors.push(`Reduced visibility: ${visibility}m`)
    }

    riskScore = Math.max(0, Math.min(100, riskScore))

    let level: RiskData['level'] = 'MINIMAL'
    if (riskScore >= 75) level = 'CRITICAL'
    else if (riskScore >= 55) level = 'HIGH'
    else if (riskScore >= 35) level = 'MEDIUM'
    else if (riskScore >= 15) level = 'LOW'

    return {
      score: Math.round(riskScore),
      level,
      factors: factors.length > 0 ? factors : ['Normal conditions'],
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  formatWeatherData(data: WeatherData): FormattedWeatherData {
    const rainfall = data.rainfall || 0
    const windSpeed = (data.wind?.speed || 0) * 3.6

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like || data.main.temp),
      humidity: Math.round(data.main.humidity),
      pressure: Math.round(data.main.pressure),
      windSpeed: Math.round(windSpeed),
      windDirection: this.getWindDirection(data.wind?.deg || 0),
      rainfall: Math.round(rainfall * 10) / 10,
      condition: data.weather?.[0]?.main || 'Unknown',
      description: data.weather?.[0]?.description || 'Unknown',
      icon: data.weather?.[0]?.icon || '01d',
      location: data.name || 'Unknown',
      timestamp: new Date((data.dt || Date.now() / 1000) * 1000)
    }
  }

  private getWindDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }
}

export const weatherService = new WeatherService()

