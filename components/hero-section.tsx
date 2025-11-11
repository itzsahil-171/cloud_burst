"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Eye, Satellite } from "lucide-react"
import { useWeatherStore } from "@/lib/store/weather-store"

export function HeroSection() {
  const { riskData } = useWeatherStore()
  
  const riskLevel = riskData?.level || 'LOW'
  const riskColor = {
    CRITICAL: 'text-red-300',
    HIGH: 'text-orange-300',
    MEDIUM: 'text-yellow-300',
    LOW: 'text-green-300',
    MINIMAL: 'text-blue-300'
  }[riskLevel] || 'text-green-300'

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/50"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            CloudGuard
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Advanced Cloud Burst Detection & Early Warning System
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full animate-pulse">
                  <Shield className="text-green-300 h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Level</h3>
              <div className={`text-2xl font-bold ${riskColor} transition-colors duration-300`}>
                {riskLevel}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Eye className="text-blue-300 h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Areas Monitored</h3>
              <div className="text-2xl font-bold text-blue-300">28 States</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Satellite className="text-purple-300 h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Sources</h3>
              <div className="text-2xl font-bold text-purple-300">IMERG + API</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <Button 
            size="lg" 
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => {
              document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            View Dashboard
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full md:w-auto bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white hover:bg-white/20"
            onClick={() => {
              document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="text-white text-2xl opacity-70">↓</div>
      </div>
    </section>
  )
}

