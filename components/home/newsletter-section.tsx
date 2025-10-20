"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Mail className="w-12 h-12 mx-auto text-primary" />
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground">Stay Connected</h2>
          <p className="text-lg text-muted-foreground">
            Subscribe to our newsletter for ministry updates, event announcements, and spiritual encouragement delivered
            to your inbox.
          </p>

          {isSubmitted ? (
            <div className="p-4 bg-primary/10 border border-primary rounded-lg animate-fade-in">
              <p className="text-primary font-medium">Thank you for subscribing! Check your email for confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
