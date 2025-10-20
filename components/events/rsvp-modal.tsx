"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

interface RSVPModalProps {
  event: {
    id: string
    title: string
    date: string
    time: string
    location: string
  }
  isOpen: boolean
  onClose: () => void
}

export function RSVPModal({ event, isOpen, onClose }: RSVPModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: "1",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement RSVP submission
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      onClose()
      setFormData({ fullName: "", email: "", phone: "", guests: "1", message: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {isSubmitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <CheckCircle2 className="w-16 h-16 mx-auto text-primary" />
            <DialogTitle className="text-2xl">RSVP Confirmed!</DialogTitle>
            <DialogDescription className="text-base">
              Thank you for registering for {event.title}. You will receive a confirmation email shortly.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif">RSVP for Event</DialogTitle>
              <DialogDescription>
                <div className="space-y-1 mt-2">
                  <p className="font-semibold text-foreground">{event.title}</p>
                  <p className="text-sm">{event.date}</p>
                  <p className="text-sm">{event.time}</p>
                  <p className="text-sm">{event.location}</p>
                </div>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any special requirements or questions?"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  Confirm RSVP
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
