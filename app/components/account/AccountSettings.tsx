import React, { useState, useEffect } from 'react'
import { User, Phone, Lock, Mail, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useAuth } from '~/context/AuthContext'
import { profileStorage } from '~/lib/profile-storage'
import { supabase } from '~/lib/supabase.client'

const AccountSettings: React.FC = () => {
    const { user, profile, refreshProfile } = useAuth()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Form state
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Load profile data on mount
    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName || '')
            setPhone(profile.phone || '')
        }
    }, [profile])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        if (!user || !profile) {
            setError('User not authenticated')
            setSaving(false)
            return
        }

        try {
            // Update profile - use userId, not profile.id
            const updatedProfile = await profileStorage.update(profile.userId, {
                fullName,
                phone
            })
            
            if (!updatedProfile) {
                throw new Error('Failed to update profile')
            }

            // Refresh profile in context
            await refreshProfile()

            setSuccess('Profile updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: any) {
            console.error('Error updating profile:', err)
            setError(err.message || 'Failed to update profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')

        // Validation
        if (!newPassword) {
            setError('Please enter a new password')
            setSaving(false)
            return
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long')
            setSaving(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match')
            setSaving(false)
            return
        }

        try {
            // Update password using Supabase Auth
            // Note: Supabase doesn't require current password if user is already authenticated
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                setError(updateError.message || 'Failed to update password. Please try again.')
                setSaving(false)
                return
            }

            // Clear password fields
            setNewPassword('')
            setConfirmPassword('')

            setSuccess('Password updated successfully!')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: any) {
            console.error('Error updating password:', err)
            setError(err.message || 'Failed to update password. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account information and security settings
                    </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">{success}</span>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Profile Information</span>
                            </CardTitle>
                            <CardDescription>
                                Update your personal information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                {/* Email (Read-only) */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4" />
                                        <span>Email Address</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed
                                    </p>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>Full Name</span>
                                    </Label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4" />
                                        <span>Phone Number</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                                    <Save className="h-4 w-4 mr-2" />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Password Change */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Lock className="h-5 w-5" />
                                <span>Change Password</span>
                            </CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter your new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Password must be at least 6 characters long
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                                    <Lock className="h-4 w-4 mr-2" />
                                    {saving ? 'Updating Password...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AccountSettings

