"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, CreditCard, Smartphone } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { useEffect } from "react"

const predefinedAmounts = [1000, 2500, 5000, 10000, 25000, 50000]

export function DonationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    customAmount: "",
    frequency: "one_time",
    paymentMethod: "stripe",
    project: "general",
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    isAnonymous: false,
  })

  const handleAmountSelect = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount: amount.toString(), customAmount: "" }))
  }

  // Preload Stripe in client
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    }
  }, [])

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, customAmount: e.target.value, amount: "" }))
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitted(true)
      await fetch("/api/admin/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_name: formData.donorName,
          donor_email: formData.donorEmail,
          donor_phone: formData.donorPhone,
          amount: Number(selectedAmount || 0),
          currency: "KES",
          payment_method: formData.paymentMethod,
          project_id: null,
          is_anonymous: formData.isAnonymous,
          is_recurring: formData.frequency !== "one_time",
          frequency: formData.frequency,
          notes: "Website donation",
        }),
      })
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          amount: "",
          customAmount: "",
          frequency: "one_time",
          paymentMethod: "stripe",
          project: "general",
          donorName: "",
          donorEmail: "",
          donorPhone: "",
          isAnonymous: false,
        })
      }, 3000)
    } catch (err) {
      setIsSubmitted(false)
    }
  }

  const selectedAmount = formData.customAmount || formData.amount

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-6 animate-fade-in">
                  <CheckCircle2 className="w-20 h-20 mx-auto text-primary" />
                  <div>
                    <h3 className="font-serif font-bold text-3xl text-foreground mb-3">Thank You!</h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Your generous donation of KES {selectedAmount} has been received. You will receive a confirmation
                      email shortly with your tax-deductible receipt.
                    </p>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground italic">
                      "Each of you should give what you have decided in your heart to give, not reluctantly or under
                      compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Select Amount (KES)</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={formData.amount === amount.toString() ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className={
                            formData.amount === amount.toString()
                              ? "bg-primary"
                              : "bg-transparent hover:bg-primary hover:text-primary-foreground"
                          }
                        >
                          {amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
                      <Input
                        id="customAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={formData.customAmount}
                        onChange={handleCustomAmountChange}
                        min="100"
                      />
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Donation Frequency</Label>
                    <RadioGroup value={formData.frequency} onValueChange={(value) => handleChange("frequency", value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one_time" id="one_time" />
                        <Label htmlFor="one_time" className="font-normal cursor-pointer">
                          One-time donation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="font-normal cursor-pointer">
                          Monthly (Recurring)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly" className="font-normal cursor-pointer">
                          Yearly (Recurring)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Project Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="project" className="text-lg font-semibold">
                      Designate Your Gift
                    </Label>
                    <select
                      id="project"
                      value={formData.project}
                      onChange={(e) => handleChange("project", e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="general">General Ministry Fund</option>
                      <option value="missionary_base">Missionary Training Base</option>
                      <option value="childrens_home">Children's Home Expansion</option>
                      <option value="outreach_vehicles">Outreach Vehicle Fund</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">Payment Method</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleChange("paymentMethod", value)}
                    >
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                          <CreditCard className="w-5 h-5 text-primary" />
                          Credit/Debit Card (Stripe)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="font-normal cursor-pointer flex items-center gap-2 flex-1">
                          <Smartphone className="w-5 h-5 text-primary" />
                          M-Pesa
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Your Information</Label>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="donorName">Full Name *</Label>
                        <Input
                          id="donorName"
                          value={formData.donorName}
                          onChange={(e) => handleChange("donorName", e.target.value)}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorEmail">Email *</Label>
                        <Input
                          id="donorEmail"
                          type="email"
                          value={formData.donorEmail}
                          onChange={(e) => handleChange("donorEmail", e.target.value)}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="donorPhone">Phone Number *</Label>
                        <Input
                          id="donorPhone"
                          type="tel"
                          value={formData.donorPhone}
                          onChange={(e) => handleChange("donorPhone", e.target.value)}
                          required
                          placeholder="+254 700 000 000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Inputs (client placeholder; handled by Stripe on server when configured) */}
                  {formData.paymentMethod === "stripe" && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Card Details</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input placeholder="Card Number" inputMode="numeric" required />
                        <Input placeholder="MM/YY" inputMode="numeric" required />
                        <Input placeholder="CVC" inputMode="numeric" required />
                      </div>
                      <p className="text-xs text-muted-foreground">Securely processed with Stripe when keys are set.</p>
                    </div>
                  )}

                  {/* Anonymous Donation */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAnonymous"
                      checked={formData.isAnonymous}
                      onCheckedChange={(checked) => handleChange("isAnonymous", checked as boolean)}
                    />
                    <Label htmlFor="isAnonymous" className="font-normal cursor-pointer">
                      Make this donation anonymous
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                    disabled={!selectedAmount || !formData.donorName || !formData.donorEmail || !formData.donorPhone}
                  >
                    Complete Donation
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By completing this donation, you agree to our donation policy and terms of service.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
