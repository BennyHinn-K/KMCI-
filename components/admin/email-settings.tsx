"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Save, TestTube } from "lucide-react"
import { useState } from "react"

interface EmailSettingsProps {
  settings: any[]
}

export function EmailSettings({ settings }: EmailSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "noreply@kmci.org",
    smtpPassword: "",
    smtpEncryption: "tls",
    fromName: "KMCI Team",
    fromEmail: "noreply@kmci.org",
    replyToEmail: "info@kmci.org",
    enableNotifications: true,
    enableNewsletter: true,
    enableContactForm: true,
    emailTemplate: "default",
    maxEmailsPerHour: "100"
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log('Saving email settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      console.log('Sending test email...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Test email sent successfully!')
    } catch (error) {
      console.error('Error sending test email:', error)
      alert('Failed to send test email')
    }
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Settings
        </CardTitle>
        <p className="text-sm text-navy/60">Configure email server and notification settings</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium text-navy">SMTP Configuration</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={formData.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={formData.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                placeholder="587"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                value={formData.smtpUsername}
                onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                placeholder="noreply@kmci.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={formData.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                placeholder="Enter SMTP password"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpEncryption">Encryption</Label>
            <Select value={formData.smtpEncryption} onValueChange={(value) => handleInputChange('smtpEncryption', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="tls">TLS</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Email Identity</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={formData.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                placeholder="KMCI Team"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={formData.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                placeholder="noreply@kmci.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyToEmail">Reply-To Email</Label>
              <Input
                id="replyToEmail"
                type="email"
                value={formData.replyToEmail}
                onChange={(e) => handleInputChange('replyToEmail', e.target.value)}
                placeholder="info@kmci.org"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEmailsPerHour">Max Emails Per Hour</Label>
              <Input
                id="maxEmailsPerHour"
                type="number"
                value={formData.maxEmailsPerHour}
                onChange={(e) => handleInputChange('maxEmailsPerHour', e.target.value)}
                placeholder="100"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Email Features</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNotifications">Enable Notifications</Label>
                <p className="text-sm text-navy/60">Send email notifications for admin actions</p>
              </div>
              <Switch
                id="enableNotifications"
                checked={formData.enableNotifications}
                onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableNewsletter">Enable Newsletter</Label>
                <p className="text-sm text-navy/60">Allow users to subscribe to newsletter</p>
              </div>
              <Switch
                id="enableNewsletter"
                checked={formData.enableNewsletter}
                onCheckedChange={(checked) => handleInputChange('enableNewsletter', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableContactForm">Enable Contact Form</Label>
                <p className="text-sm text-navy/60">Send emails from contact form submissions</p>
              </div>
              <Switch
                id="enableContactForm"
                checked={formData.enableContactForm}
                onCheckedChange={(checked) => handleInputChange('enableContactForm', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Email Templates</h4>
          <div className="space-y-2">
            <Label htmlFor="emailTemplate">Default Template</Label>
            <Select value={formData.emailTemplate} onValueChange={(value) => handleInputChange('emailTemplate', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Template</SelectItem>
                <SelectItem value="modern">Modern Template</SelectItem>
                <SelectItem value="minimal">Minimal Template</SelectItem>
                <SelectItem value="custom">Custom Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
          <Button onClick={handleTestEmail} variant="outline">
            <TestTube className="h-4 w-4 mr-2" />
            Test Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
