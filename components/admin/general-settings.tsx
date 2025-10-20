"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save } from "lucide-react"
import { useState } from "react"

interface GeneralSettingsProps {
  settings: any[]
}

export function GeneralSettings({ settings }: GeneralSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    siteName: "Kingdom Missions Center International",
    siteDescription: "A Christian missions organization dedicated to discipling communities and transforming lives for Christ's service.",
    timezone: "Africa/Nairobi",
    language: "en",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileSize: "10",
    allowedFileTypes: "jpg,jpeg,png,gif,pdf,doc,docx"
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real app, this would save to the database
      console.log('Saving general settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          General Settings
        </CardTitle>
        <p className="text-sm text-navy/60">Basic site configuration and preferences</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteName">Site Name</Label>
          <Input
            id="siteName"
            value={formData.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            placeholder="Enter site name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            value={formData.siteDescription}
            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
            placeholder="Enter site description"
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={formData.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                <SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem>
                <SelectItem value="Africa/Cairo">Africa/Cairo</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <p className="text-sm text-navy/60">Temporarily disable public access</p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={formData.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowRegistration">Allow User Registration</Label>
              <p className="text-sm text-navy/60">Enable public user registration</p>
            </div>
            <Switch
              id="allowRegistration"
              checked={formData.allowRegistration}
              onCheckedChange={(checked) => handleInputChange('allowRegistration', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              <p className="text-sm text-navy/60">Users must verify email before access</p>
            </div>
            <Switch
              id="requireEmailVerification"
              checked={formData.requireEmailVerification}
              onCheckedChange={(checked) => handleInputChange('requireEmailVerification', checked)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
            <Input
              id="maxFileSize"
              type="number"
              value={formData.maxFileSize}
              onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
              placeholder="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
            <Input
              id="allowedFileTypes"
              value={formData.allowedFileTypes}
              onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
              placeholder="jpg,jpeg,png,gif,pdf"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  )
}
