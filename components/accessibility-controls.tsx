"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, X } from "lucide-react"

export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const savedReduceMotion = localStorage.getItem("reduceMotion") === "true"
    const savedHighContrast = localStorage.getItem("highContrast") === "true"
    const savedLargeText = localStorage.getItem("largeText") === "true"

    setReduceMotion(savedReduceMotion)
    setHighContrast(savedHighContrast)
    setLargeText(savedLargeText)

    // Apply preferences
    if (savedReduceMotion) {
      document.documentElement.classList.add("reduce-motion")
    }
    if (savedHighContrast) {
      document.documentElement.classList.add("high-contrast")
    }
    if (savedLargeText) {
      document.documentElement.classList.add("large-text")
    }
  }, [])

  const toggleReduceMotion = (checked: boolean) => {
    setReduceMotion(checked)
    localStorage.setItem("reduceMotion", String(checked))
    if (checked) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
  }

  const toggleHighContrast = (checked: boolean) => {
    setHighContrast(checked)
    localStorage.setItem("highContrast", String(checked))
    if (checked) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  const toggleLargeText = (checked: boolean) => {
    setLargeText(checked)
    localStorage.setItem("largeText", String(checked))
    if (checked) {
      document.documentElement.classList.add("large-text")
    } else {
      document.documentElement.classList.remove("large-text")
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-premium hover:shadow-premium-lg"
        aria-label="Accessibility settings"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-navy">Accessibility</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion" className="text-base">
                  Reduce Motion
                </Label>
                <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={toggleReduceMotion} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="text-base">
                  High Contrast
                </Label>
                <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="large-text" className="text-base">
                  Large Text
                </Label>
                <Switch id="large-text" checked={largeText} onCheckedChange={toggleLargeText} />
              </div>
            </div>

            <p className="text-sm text-navy/60">
              These settings will be saved and applied across all pages of the website.
            </p>
          </Card>
        </div>
      )}
    </>
  )
}
