"use client"

import { useState } from "react"
import Link from "next/link"
import { CloudRain, Menu, X } from "lucide-react"
import { SOSAlert } from "@/components/sos-alert"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <CloudRain className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CloudGuard
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <Link href="#alerts" className="text-gray-700 hover:text-blue-600 transition-colors">
              Alerts
            </Link>
            <Link href="#education" className="text-gray-700 hover:text-blue-600 transition-colors">
              Learn
            </Link>
            <Link href="#forecast" className="text-gray-700 hover:text-blue-600 transition-colors">
              Forecast
            </Link>
            <SOSAlert />
          </div>
          
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 pb-4">
            <Link href="#dashboard" className="block text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="#alerts" className="block text-gray-700 hover:text-blue-600">
              Alerts
            </Link>
            <Link href="#education" className="block text-gray-700 hover:text-blue-600">
              Learn
            </Link>
            <Link href="#forecast" className="block text-gray-700 hover:text-blue-600">
              Forecast
            </Link>
            <div className="w-full">
              <SOSAlert />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

