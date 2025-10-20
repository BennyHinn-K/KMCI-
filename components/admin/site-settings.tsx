"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Globe, Save } from "lucide-react"
import { useState } from "react"

interface SiteSettingsProps {
  settings: any[]
}

export function SiteSettings({ settings }: SiteSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    siteUrl: "https://kmci.org",
    contactEmail: "info@kmci.org",
    contactPhone: "+254 700 000 000",
    address: "P.O. Box 12345, Nairobi, Kenya",
    facebookUrl: "https://facebook.com/kmci",
    twitterUrl: "https://twitter.com/kmci",
    instagramUrl: "https://instagram.com/kmci",
    youtubeUrl: "https://youtube.com/kmci",
    googleMapsEmbed: "",
    googleAnalyticsId: "",
    facebookPixelId: "",
    metaTitle: "Kingdom Missions Center International",
    metaDescription: "A Christian missions organization dedicated to discipling communities and transforming lives for Christ's service.",
    metaKeywords: "missions, christian, ministry, kenya, africa, discipleship"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log('Saving site settings:', formData)
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
          <Globe className="h-5 w-5" />
          Site Information
        </CardTitle>
        <p className="text-sm text-navy/60">Website details and contact information</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteUrl">Site URL</Label>
          <Input
            id="siteUrl"
            value={formData.siteUrl}
            onChange={(e) => handleInputChange('siteUrl', e.target.value)}
            placeholder="https://kmci.org"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="info@kmci.org"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="+254 700 000 000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="P.O. Box 12345, Nairobi, Kenya"
            rows={2}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Social Media Links</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook</Label>
              <Input
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/kmci"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitterUrl">Twitter</Label>
              <Input
                id="twitterUrl"
                value={formData.twitterUrl}
                onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/kmci"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/kmci"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeUrl">YouTube</Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                placeholder="https://youtube.com/kmci"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Analytics & Tracking</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                value={formData.googleAnalyticsId}
                onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                placeholder="GA-XXXXXXXXX-X"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
              <Input
                id="facebookPixelId"
                value={formData.facebookPixelId}
                onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
                placeholder="1234567890123456"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">SEO Settings</h4>
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              placeholder="Page title for search engines"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Description for search engines"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              value={formData.metaKeywords}
              onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
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
