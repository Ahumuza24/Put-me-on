import React, { useState } from 'react'
import { 
    Settings, 
    Save,
    Bell,
    DollarSign,
    Shield,
    Mail,
    Globe,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { CheckCircle } from 'lucide-react'

interface PlatformSettings {
    // General Settings
    platformName: string
    platformEmail: string
    supportEmail: string
    platformUrl: string
    
    // Commission Settings
    commissionRate: number
    minimumPayout: number
    payoutSchedule: 'daily' | 'weekly' | 'monthly'
    
    // Feature Toggles
    enableEmailNotifications: boolean
    enableSMSNotifications: boolean
    requireProviderVerification: boolean
    requireClientVerification: boolean
    enableDisputes: boolean
    enableReviews: boolean
    
    // Maintenance Mode
    maintenanceMode: boolean
    maintenanceMessage: string
    
    // Security Settings
    requireTwoFactorAuth: boolean
    sessionTimeout: number
    maxLoginAttempts: number
}

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<PlatformSettings>({
        platformName: 'PutMeOn',
        platformEmail: 'admin@putmeon.com',
        supportEmail: 'support@putmeon.com',
        platformUrl: 'https://putmeon.com',
        commissionRate: 10,
        minimumPayout: 10000,
        payoutSchedule: 'weekly',
        enableEmailNotifications: true,
        enableSMSNotifications: false,
        requireProviderVerification: true,
        requireClientVerification: false,
        enableDisputes: true,
        enableReviews: true,
        maintenanceMode: false,
        maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
        requireTwoFactorAuth: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5
    })

    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        setSaveSuccess(false)
        try {
            // In a real app, you'd save to the database
            // For now, we'll simulate an API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (error) {
            console.error('Error saving settings:', error)
        } finally {
            setSaving(false)
        }
    }

    const updateSetting = <K extends keyof PlatformSettings>(
        key: K,
        value: PlatformSettings[K]
    ) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Platform Settings</h2>
                    <p className="text-muted-foreground">
                        Configure platform-wide settings and preferences.
                    </p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {saveSuccess && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                        Settings have been saved successfully.
                    </AlertDescription>
                </Alert>
            )}

            {/* General Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Globe className="h-5 w-5" />
                        <span>General Settings</span>
                    </CardTitle>
                    <CardDescription>Basic platform information and contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="platformName">Platform Name</Label>
                            <Input
                                id="platformName"
                                value={settings.platformName}
                                onChange={(e) => updateSetting('platformName', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="platformUrl">Platform URL</Label>
                            <Input
                                id="platformUrl"
                                value={settings.platformUrl}
                                onChange={(e) => updateSetting('platformUrl', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="platformEmail">Platform Email</Label>
                            <Input
                                id="platformEmail"
                                type="email"
                                value={settings.platformEmail}
                                onChange={(e) => updateSetting('platformEmail', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="supportEmail">Support Email</Label>
                            <Input
                                id="supportEmail"
                                type="email"
                                value={settings.supportEmail}
                                onChange={(e) => updateSetting('supportEmail', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Commission Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Commission & Payments</span>
                    </CardTitle>
                    <CardDescription>Configure platform fees and payout settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                            <Input
                                id="commissionRate"
                                type="number"
                                min="0"
                                max="100"
                                value={settings.commissionRate}
                                onChange={(e) => updateSetting('commissionRate', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="minimumPayout">Minimum Payout (UGX)</Label>
                            <Input
                                id="minimumPayout"
                                type="number"
                                min="0"
                                value={settings.minimumPayout}
                                onChange={(e) => updateSetting('minimumPayout', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                            <Select
                                value={settings.payoutSchedule}
                                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                                    updateSetting('payoutSchedule', value)
                                }
                            >
                                <SelectTrigger id="payoutSchedule">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Feature Toggles</span>
                    </CardTitle>
                    <CardDescription>Enable or disable platform features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="emailNotifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Send email notifications to users
                            </p>
                        </div>
                        <Switch
                            id="emailNotifications"
                            checked={settings.enableEmailNotifications}
                            onCheckedChange={(checked) => updateSetting('enableEmailNotifications', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="smsNotifications">SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Send SMS notifications to users
                            </p>
                        </div>
                        <Switch
                            id="smsNotifications"
                            checked={settings.enableSMSNotifications}
                            onCheckedChange={(checked) => updateSetting('enableSMSNotifications', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="providerVerification">Require Provider Verification</Label>
                            <p className="text-sm text-muted-foreground">
                                Require verification for new providers
                            </p>
                        </div>
                        <Switch
                            id="providerVerification"
                            checked={settings.requireProviderVerification}
                            onCheckedChange={(checked) => updateSetting('requireProviderVerification', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="clientVerification">Require Client Verification</Label>
                            <p className="text-sm text-muted-foreground">
                                Require verification for new clients
                            </p>
                        </div>
                        <Switch
                            id="clientVerification"
                            checked={settings.requireClientVerification}
                            onCheckedChange={(checked) => updateSetting('requireClientVerification', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="enableDisputes">Enable Disputes</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow users to file disputes for bookings
                            </p>
                        </div>
                        <Switch
                            id="enableDisputes"
                            checked={settings.enableDisputes}
                            onCheckedChange={(checked) => updateSetting('enableDisputes', checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="enableReviews">Enable Reviews</Label>
                            <p className="text-sm text-muted-foreground">
                                Allow users to leave reviews and ratings
                            </p>
                        </div>
                        <Switch
                            id="enableReviews"
                            checked={settings.enableReviews}
                            onCheckedChange={(checked) => updateSetting('enableReviews', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Maintenance Mode</span>
                    </CardTitle>
                    <CardDescription>Put the platform in maintenance mode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Temporarily disable platform access for all users
                            </p>
                        </div>
                        <Switch
                            id="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                        />
                    </div>
                    {settings.maintenanceMode && (
                        <div>
                            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                            <Textarea
                                id="maintenanceMessage"
                                value={settings.maintenanceMessage}
                                onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                                rows={3}
                                placeholder="Enter maintenance message..."
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5" />
                        <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>Configure security and authentication settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="twoFactorAuth">Require Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Require 2FA for admin accounts
                            </p>
                        </div>
                        <Switch
                            id="twoFactorAuth"
                            checked={settings.requireTwoFactorAuth}
                            onCheckedChange={(checked) => updateSetting('requireTwoFactorAuth', checked)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                            <Input
                                id="sessionTimeout"
                                type="number"
                                min="5"
                                max="480"
                                value={settings.sessionTimeout}
                                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value) || 30)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                            <Input
                                id="maxLoginAttempts"
                                type="number"
                                min="3"
                                max="10"
                                value={settings.maxLoginAttempts}
                                onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value) || 5)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminSettings

