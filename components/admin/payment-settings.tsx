"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Save, TestTube } from "lucide-react"
import { useState } from "react"

interface PaymentSettingsProps {
  settings: any[]
}

export function PaymentSettings({ settings }: PaymentSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    stripePublishableKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
    mpesaConsumerKey: "",
    mpesaConsumerSecret: "",
    mpesaShortcode: "",
    mpesaPasskey: "",
    mpesaEnvironment: "sandbox",
    currency: "KES",
    enableStripe: true,
    enableMpesa: true,
    enableBankTransfer: true,
    enableCash: true,
    minDonationAmount: "100",
    maxDonationAmount: "1000000",
    enableRecurringDonations: true,
    enableAnonymousDonations: true
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log('Saving payment settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestPayment = async () => {
    try {
      console.log('Testing payment integration...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Payment test completed successfully!')
    } catch (error) {
      console.error('Error testing payment:', error)
      alert('Payment test failed')
    }
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Settings
        </CardTitle>
        <p className="text-sm text-navy/60">Configure payment gateways and donation settings</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium text-navy">Stripe Configuration</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableStripe">Enable Stripe</Label>
                <p className="text-sm text-navy/60">Accept credit card payments via Stripe</p>
              </div>
              <Switch
                id="enableStripe"
                checked={formData.enableStripe}
                onCheckedChange={(checked) => handleInputChange('enableStripe', checked)}
              />
            </div>

            {formData.enableStripe && (
              <div className="space-y-4 pl-4 border-l-2 border-navy/10">
                <div className="space-y-2">
                  <Label htmlFor="stripePublishableKey">Publishable Key</Label>
                  <Input
                    id="stripePublishableKey"
                    value={formData.stripePublishableKey}
                    onChange={(e) => handleInputChange('stripePublishableKey', e.target.value)}
                    placeholder="pk_test_..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripeSecretKey">Secret Key</Label>
                  <Input
                    id="stripeSecretKey"
                    type="password"
                    value={formData.stripeSecretKey}
                    onChange={(e) => handleInputChange('stripeSecretKey', e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stripeWebhookSecret">Webhook Secret</Label>
                  <Input
                    id="stripeWebhookSecret"
                    type="password"
                    value={formData.stripeWebhookSecret}
                    onChange={(e) => handleInputChange('stripeWebhookSecret', e.target.value)}
                    placeholder="whsec_..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">M-Pesa Configuration</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableMpesa">Enable M-Pesa</Label>
                <p className="text-sm text-navy/60">Accept mobile money payments via M-Pesa</p>
              </div>
              <Switch
                id="enableMpesa"
                checked={formData.enableMpesa}
                onCheckedChange={(checked) => handleInputChange('enableMpesa', checked)}
              />
            </div>

            {formData.enableMpesa && (
              <div className="space-y-4 pl-4 border-l-2 border-navy/10">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mpesaConsumerKey">Consumer Key</Label>
                    <Input
                      id="mpesaConsumerKey"
                      value={formData.mpesaConsumerKey}
                      onChange={(e) => handleInputChange('mpesaConsumerKey', e.target.value)}
                      placeholder="Your M-Pesa consumer key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mpesaConsumerSecret">Consumer Secret</Label>
                    <Input
                      id="mpesaConsumerSecret"
                      type="password"
                      value={formData.mpesaConsumerSecret}
                      onChange={(e) => handleInputChange('mpesaConsumerSecret', e.target.value)}
                      placeholder="Your M-Pesa consumer secret"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mpesaShortcode">Shortcode</Label>
                    <Input
                      id="mpesaShortcode"
                      value={formData.mpesaShortcode}
                      onChange={(e) => handleInputChange('mpesaShortcode', e.target.value)}
                      placeholder="174379"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mpesaPasskey">Passkey</Label>
                    <Input
                      id="mpesaPasskey"
                      type="password"
                      value={formData.mpesaPasskey}
                      onChange={(e) => handleInputChange('mpesaPasskey', e.target.value)}
                      placeholder="Your M-Pesa passkey"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mpesaEnvironment">Environment</Label>
                  <Select value={formData.mpesaEnvironment} onValueChange={(value) => handleInputChange('mpesaEnvironment', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                      <SelectItem value="production">Production (Live)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Other Payment Methods</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableBankTransfer">Enable Bank Transfer</Label>
                <p className="text-sm text-navy/60">Allow bank transfer donations</p>
              </div>
              <Switch
                id="enableBankTransfer"
                checked={formData.enableBankTransfer}
                onCheckedChange={(checked) => handleInputChange('enableBankTransfer', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableCash">Enable Cash Donations</Label>
                <p className="text-sm text-navy/60">Allow cash donation tracking</p>
              </div>
              <Switch
                id="enableCash"
                checked={formData.enableCash}
                onCheckedChange={(checked) => handleInputChange('enableCash', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Donation Settings</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minDonationAmount">Minimum Donation (KSh)</Label>
              <Input
                id="minDonationAmount"
                type="number"
                value={formData.minDonationAmount}
                onChange={(e) => handleInputChange('minDonationAmount', e.target.value)}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDonationAmount">Maximum Donation (KSh)</Label>
              <Input
                id="maxDonationAmount"
                type="number"
                value={formData.maxDonationAmount}
                onChange={(e) => handleInputChange('maxDonationAmount', e.target.value)}
                placeholder="1000000"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableRecurringDonations">Enable Recurring Donations</Label>
                <p className="text-sm text-navy/60">Allow monthly/yearly recurring donations</p>
              </div>
              <Switch
                id="enableRecurringDonations"
                checked={formData.enableRecurringDonations}
                onCheckedChange={(checked) => handleInputChange('enableRecurringDonations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAnonymousDonations">Enable Anonymous Donations</Label>
                <p className="text-sm text-navy/60">Allow donors to remain anonymous</p>
              </div>
              <Switch
                id="enableAnonymousDonations"
                checked={formData.enableAnonymousDonations}
                onCheckedChange={(checked) => handleInputChange('enableAnonymousDonations', checked)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
          <Button onClick={handleTestPayment} variant="outline">
            <TestTube className="h-4 w-4 mr-2" />
            Test Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
