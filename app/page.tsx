"use client"

import { useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { WeatherCards } from "@/components/weather-cards"
import { LocationSearch } from "@/components/location-search"
import { ChartsComponent } from "@/components/charts-component"
import { RiskAssessment } from "@/components/risk-assessment"
import { ApiKeyConfig } from "@/components/api-key-config"
import { ForecastSection } from "@/components/forecast-section"
import { Toaster } from "@/components/ui/toaster"
import { useWeatherStore } from "@/lib/store/weather-store"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { fetchWeather, riskData, error } = useWeatherStore()
  const { toast } = useToast()

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(() => {
      fetchWeather()
    }, 10 * 60 * 1000) // Every 10 minutes

    return () => clearInterval(interval)
  }, [fetchWeather])

  useEffect(() => {
    if (riskData) {
      if (riskData.score >= 75) {
        toast({
          variant: "destructive",
          title: "CRITICAL ALERT",
          description: `Cloud burst risk is ${riskData.score}%. Take immediate precautions!`,
        })
      } else if (riskData.score >= 55) {
        toast({
          variant: "warning",
          title: "WARNING",
          description: `Cloud burst risk is elevated (${riskData.score}%). Stay alert!`,
        })
      } else if (riskData.warnings && riskData.warnings.length > 0) {
        riskData.warnings.forEach((warning) => {
          toast({
            variant: "destructive",
            title: "Alert",
            description: warning,
          })
        })
      }
    }
  }, [riskData, toast])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error, toast])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <HeroSection />
      
      <section id="dashboard" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Real-time Monitoring Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced satellite data integration with AI-powered cloud burst prediction
            </p>
          </div>

          {/* API Key Config */}
          <div className="max-w-2xl mx-auto mb-8">
            <ApiKeyConfig />
          </div>

          {/* Location Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <LocationSearch />
          </div>

          {/* Weather Cards */}
          <div className="mb-12">
            <WeatherCards />
          </div>

          {/* Charts */}
          <div className="mb-12">
            <ChartsComponent />
          </div>

          {/* Risk Assessment */}
          <div className="mb-12">
            <RiskAssessment />
          </div>
        </div>
      </section>

      {/* Forecast Section */}
      <ForecastSection />

      {/* Education Section */}
      <section id="education" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Understanding Cloud Bursts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn about cloud bursts, their causes, impacts, and how to stay safe during extreme rainfall events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* What is a Cloud Burst */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">What is a Cloud Burst?</h3>
              <p className="text-gray-600">
                A cloud burst is an extreme weather event where heavy rainfall occurs over a short period,
                typically 100mm or more per hour. Unlike normal rainfall, cloud bursts happen when warm,
                moisture-laden air rapidly rises and condenses.
              </p>
            </div>

            {/* Causes */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Causes of Cloud Bursts</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Atmospheric instability from temperature differences</li>
                <li>• High humidity and moisture content in the air</li>
                <li>• Orographic lifting over mountains and hills</li>
                <li>• Convergence of air masses creating upward motion</li>
              </ul>
            </div>

            {/* Impacts */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Impacts & Dangers</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Flash flooding in low-lying areas</li>
                <li>• Waterlogging and urban flooding</li>
                <li>• Landslides on hilly terrain</li>
                <li>• Property damage and infrastructure collapse</li>
                <li>• Loss of life from drowning or accidents</li>
              </ul>
            </div>

            {/* Vulnerable Areas */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Vulnerable Areas</h3>
              <p className="text-gray-600 mb-3">
                Cloud bursts are most common in regions with specific geographical and climatic conditions:
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Mountainous regions (Himalayas, Western Ghats)</li>
                <li>• Coastal areas with high humidity</li>
                <li>• Urban areas with poor drainage</li>
                <li>• Regions with sudden weather changes</li>
              </ul>
            </div>

            {/* Prevention */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Prevention & Safety</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Monitor weather forecasts and warnings</li>
                <li>• Avoid low-lying areas during heavy rain</li>
                <li>• Keep emergency supplies ready</li>
                <li>• Have an emergency evacuation plan</li>
                <li>• Stay away from electrical equipment outdoors</li>
              </ul>
            </div>

            {/* Technology Solutions */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Technology Solutions</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• AI-powered weather prediction models</li>
                <li>• Satellite-based rainfall monitoring</li>
                <li>• Doppler weather radar systems</li>
                <li>• Automated early warning systems</li>
                <li>• Real-time weather monitoring stations</li>
              </ul>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cloud Burst Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100mm+</div>
                <div className="text-gray-600">Rainfall per hour during a cloud burst</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">15-30 min</div>
                <div className="text-gray-600">Typical duration of a cloud burst event</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">500+ deaths</div>
                <div className="text-gray-600">Annual fatalities from flash floods globally</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CloudGuard</h3>
              <p className="text-gray-400">
                Advanced cloud burst detection and early warning system powered by satellite data and AI technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Emergency Contacts</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="tel:112" className="hover:text-white">National Emergency: 112</a></li>
                <li><a href="tel:101" className="hover:text-white">Fire Department: 101</a></li>
                <li><a href="tel:108" className="hover:text-white">Medical Emergency: 108</a></li>
                <li><a href="tel:100" className="hover:text-white">Police: 100</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#dashboard" className="hover:text-white">Dashboard</a></li>
                <li><a href="#forecast" className="hover:text-white">Forecast</a></li>
                <li><a href="#education" className="hover:text-white">Learn</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Data Sources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Open-Meteo API (FREE)</li>
                <li>OpenWeatherMap (Optional)</li>
                <li>Real-time Weather Data</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 CloudGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </main>
  )
}
