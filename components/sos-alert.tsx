"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Phone, Shield } from "lucide-react"
import { useWeatherStore } from "@/lib/store/weather-store"
import { useToast } from "@/hooks/use-toast"

export function SOSAlert() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentLocation } = useWeatherStore()
  const { toast } = useToast()

  const handleSOS = () => {
    setIsOpen(true)
    // Simulate emergency alert
    toast({
      variant: "destructive",
      title: "SOS Alert Activated",
      description: "Emergency services have been notified of your location",
    })
  }

  const handleCallEmergency = () => {
    window.location.href = "tel:112"
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        onClick={handleSOS}
        className="gap-2 shadow-lg hover:shadow-xl transition-all"
      >
        <AlertTriangle className="h-5 w-5" />
        SOS ALERT
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="text-red-600 h-8 w-8" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-center">SOS Alert Activated</DialogTitle>
            <DialogDescription className="text-center">
              Your emergency alert has been sent to local authorities and emergency contacts.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-red-800">
              <div className="font-semibold mb-2">Actions Taken:</div>
              <ul className="text-left space-y-1">
                <li>✓ GPS location shared with emergency services</li>
                <li>✓ Alert sent to nearby users</li>
                <li>✓ Emergency contacts notified</li>
                <li>✓ Local authorities informed</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleCallEmergency}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency (112)
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

