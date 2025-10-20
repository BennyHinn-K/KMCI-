"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Save, Key, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface SecuritySettingsProps {
  settings: any[]
}

export function SecuritySettings({ settings }: SecuritySettingsProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sessionTimeout: "24",
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    requireTwoFactor: false,
    enableAuditLog: true,
    enableIpWhitelist: false,
    allowedIps: "",
    enableRateLimiting: true,
    rateLimitRequests: "100",
    rateLimitWindow: "15",
    enableCors: true,
    corsOrigins: "https://kmci.org,https://www.kmci.org",
    enableHttps: true,
    enableSecurityHeaders: true,
    enableContentSecurityPolicy: true,
    enableXssProtection: true,
    enableClickjackingProtection: true,
    enableHsts: true,
    hstsMaxAge: "31536000"
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      console.log('Saving security settings:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetSecurity = async () => {
    if (confirm('Are you sure you want to reset all security settings to defaults? This action cannot be undone.')) {
      console.log('Resetting security settings...')
    }
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
        <p className="text-sm text-navy/60">Configure security policies and access controls</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-navy">Authentication & Sessions</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={formData.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                placeholder="24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={formData.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
              <Input
                id="lockoutDuration"
                type="number"
                value={formData.lockoutDuration}
                onChange={(e) => handleInputChange('lockoutDuration', e.target.value)}
                placeholder="15"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
              <p className="text-sm text-navy/60">Force 2FA for all admin users</p>
            </div>
            <Switch
              id="requireTwoFactor"
              checked={formData.requireTwoFactor}
              onCheckedChange={(checked) => handleInputChange('requireTwoFactor', checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Access Control</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
              <p className="text-sm text-navy/60">Log all admin actions and changes</p>
            </div>
            <Switch
              id="enableAuditLog"
              checked={formData.enableAuditLog}
              onCheckedChange={(checked) => handleInputChange('enableAuditLog', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableIpWhitelist">Enable IP Whitelist</Label>
              <p className="text-sm text-navy/60">Restrict admin access to specific IP addresses</p>
            </div>
            <Switch
              id="enableIpWhitelist"
              checked={formData.enableIpWhitelist}
              onCheckedChange={(checked) => handleInputChange('enableIpWhitelist', checked)}
            />
          </div>

          {formData.enableIpWhitelist && (
            <div className="space-y-2 pl-4 border-l-2 border-navy/10">
              <Label htmlFor="allowedIps">Allowed IP Addresses</Label>
              <Input
                id="allowedIps"
                value={formData.allowedIps}
                onChange={(e) => handleInputChange('allowedIps', e.target.value)}
                placeholder="192.168.1.1, 10.0.0.1, 203.0.113.0/24"
              />
              <p className="text-xs text-navy/60">Separate multiple IPs with commas. Supports CIDR notation.</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Rate Limiting</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableRateLimiting">Enable Rate Limiting</Label>
              <p className="text-sm text-navy/60">Limit requests per IP address</p>
            </div>
            <Switch
              id="enableRateLimiting"
              checked={formData.enableRateLimiting}
              onCheckedChange={(checked) => handleInputChange('enableRateLimiting', checked)}
            />
          </div>

          {formData.enableRateLimiting && (
            <div className="grid gap-4 md:grid-cols-2 pl-4 border-l-2 border-navy/10">
              <div className="space-y-2">
                <Label htmlFor="rateLimitRequests">Max Requests</Label>
                <Input
                  id="rateLimitRequests"
                  type="number"
                  value={formData.rateLimitRequests}
                  onChange={(e) => handleInputChange('rateLimitRequests', e.target.value)}
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rateLimitWindow">Time Window (minutes)</Label>
                <Input
                  id="rateLimitWindow"
                  type="number"
                  value={formData.rateLimitWindow}
                  onChange={(e) => handleInputChange('rateLimitWindow', e.target.value)}
                  placeholder="15"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">CORS & Headers</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableCors">Enable CORS</Label>
              <p className="text-sm text-navy/60">Allow cross-origin requests</p>
            </div>
            <Switch
              id="enableCors"
              checked={formData.enableCors}
              onCheckedChange={(checked) => handleInputChange('enableCors', checked)}
            />
          </div>

          {formData.enableCors && (
            <div className="space-y-2 pl-4 border-l-2 border-navy/10">
              <Label htmlFor="corsOrigins">Allowed Origins</Label>
              <Input
                id="corsOrigins"
                value={formData.corsOrigins}
                onChange={(e) => handleInputChange('corsOrigins', e.target.value)}
                placeholder="https://kmci.org, https://www.kmci.org"
              />
              <p className="text-xs text-navy/60">Separate multiple origins with commas</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableHttps">Force HTTPS</Label>
              <p className="text-sm text-navy/60">Redirect all HTTP traffic to HTTPS</p>
            </div>
            <Switch
              id="enableHttps"
              checked={formData.enableHttps}
              onCheckedChange={(checked) => handleInputChange('enableHttps', checked)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-navy">Security Headers</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableSecurityHeaders">Enable Security Headers</Label>
                <p className="text-sm text-navy/60">Add security headers to all responses</p>
              </div>
              <Switch
                id="enableSecurityHeaders"
                checked={formData.enableSecurityHeaders}
                onCheckedChange={(checked) => handleInputChange('enableSecurityHeaders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableContentSecurityPolicy">Content Security Policy</Label>
                <p className="text-sm text-navy/60">Prevent XSS attacks</p>
              </div>
              <Switch
                id="enableContentSecurityPolicy"
                checked={formData.enableContentSecurityPolicy}
                onCheckedChange={(checked) => handleInputChange('enableContentSecurityPolicy', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableXssProtection">XSS Protection</Label>
                <p className="text-sm text-navy/60">Enable browser XSS filtering</p>
              </div>
              <Switch
                id="enableXssProtection"
                checked={formData.enableXssProtection}
                onCheckedChange={(checked) => handleInputChange('enableXssProtection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableClickjackingProtection">Clickjacking Protection</Label>
                <p className="text-sm text-navy/60">Prevent iframe embedding</p>
              </div>
              <Switch
                id="enableClickjackingProtection"
                checked={formData.enableClickjackingProtection}
                onCheckedChange={(checked) => handleInputChange('enableClickjackingProtection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableHsts">HTTP Strict Transport Security</Label>
                <p className="text-sm text-navy/60">Force HTTPS connections</p>
              </div>
              <Switch
                id="enableHsts"
                checked={formData.enableHsts}
                onCheckedChange={(checked) => handleInputChange('enableHsts', checked)}
              />
            </div>

            {formData.enableHsts && (
              <div className="space-y-2 pl-4 border-l-2 border-navy/10">
                <Label htmlFor="hstsMaxAge">HSTS Max Age (seconds)</Label>
                <Input
                  id="hstsMaxAge"
                  type="number"
                  value={formData.hstsMaxAge}
                  onChange={(e) => handleInputChange('hstsMaxAge', e.target.value)}
                  placeholder="31536000"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-navy/10">
          <Button onClick={handleSave} disabled={loading} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Settings"}
          </Button>
          <Button onClick={handleResetSecurity} variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
