import React, { useState, useEffect } from 'react'
import { 
    User, 
    MapPin, 
    Phone, 
    Mail, 
    Briefcase, 
    Star, 
    Camera, 
    Save,
    Edit,
    Upload,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Switch } from '~/components/ui/switch'
import ProviderLayout from './ProviderLayout'
import UserAvatar from './UserAvatar'
import { useAuth } from '~/context/AuthContext'

interface ProviderProfileProps {
    // No props needed - will use useAuth hook internally
}

interface ProfileData {
    fullName: string
    bio: string
    location: string
    phone: string
    email: string
    serviceCategory: string
    hourlyRate: number
    experience: string
    skills: string[]
    portfolio: string[]
    availability: boolean
    verified: boolean
    rating: number
    completedJobs: number
}

const ProviderProfile: React.FC<ProviderProfileProps> = () => {
    const { user, profile: initialProfile } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const [profile, setProfile] = useState<ProfileData>({
        fullName: '',
        bio: '',
        location: '',
        phone: '',
        email: user?.email || '',
        serviceCategory: '',
        hourlyRate: 0,
        experience: '',
        skills: [],
        portfolio: [],
        availability: true,
        verified: false,
        rating: 0,
        completedJobs: 0
    })

    const [newSkill, setNewSkill] = useState('')
    const [newPortfolio, setNewPortfolio] = useState('')

    // Initialize profile from stored data or use defaults
    useEffect(() => {
        if (initialProfile) {
            setProfile({
                fullName: initialProfile.fullName || '',
                bio: initialProfile.bio || '',
                location: initialProfile.location || '',
                phone: initialProfile.phone || '',
                email: initialProfile.email || user?.email || '',
                serviceCategory: initialProfile.serviceCategory || '',
                hourlyRate: initialProfile.hourlyRate || 0,
                experience: initialProfile.experience || '',
                skills: initialProfile.skills || [],
                portfolio: initialProfile.portfolio || [],
                availability: initialProfile.availability ?? true,
                verified: initialProfile.verified ?? false,
                rating: initialProfile.rating || 0,
                completedJobs: initialProfile.completedJobs || 0
            })
        } else {
            // Fallback to defaults if no profile data
            setProfile({
                fullName: '',
                bio: '',
                location: '',
                phone: '',
                email: user?.email || '',
                serviceCategory: '',
                hourlyRate: 0,
                experience: '',
                skills: [],
                portfolio: [],
                availability: true,
                verified: false,
                rating: 0,
                completedJobs: 0
            })
        }
    }, [initialProfile])

    const handleSave = async () => {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setSuccess('Profile updated successfully!')
            setIsEditing(false)
        } catch (err) {
            setError('Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const addSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }))
            setNewSkill('')
        }
    }

    const removeSkill = (skill: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }))
    }

    const addPortfolio = () => {
        if (newPortfolio.trim() && !profile.portfolio.includes(newPortfolio.trim())) {
            setProfile(prev => ({
                ...prev,
                portfolio: [...prev.portfolio, newPortfolio.trim()]
            }))
            setNewPortfolio('')
        }
    }

    const removePortfolio = (url: string) => {
        setProfile(prev => ({
            ...prev,
            portfolio: prev.portfolio.filter(p => p !== url)
        }))
    }

    const actions = (
        <div className="flex items-center space-x-4">
            {isEditing ? (
                <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </>
            ) : (
                <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            )}
            <UserAvatar />
        </div>
    )

    return (
        <ProviderLayout
            title="Provider Profile"
            description="Manage your professional profile"
            actions={actions}
        >
                {/* Success/Error Messages */}
                {success && (
                    <div
                        className="mb-6 flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800"
                    >
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{success}</span>
                    </div>
                )}

                {error && (
                    <div
                        className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800"
                    >
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Overview */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="relative mx-auto w-32 h-32 mb-4">
                                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="h-16 w-16 text-primary" />
                                    </div>
                                    {isEditing && (
                                        <Button
                                            size="sm"
                                            className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                                        >
                                            <Camera className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                <CardTitle>{profile.fullName}</CardTitle>
                                <CardDescription>{profile.serviceCategory}</CardDescription>
                                <div className="flex items-center justify-center space-x-2 mt-2">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span className="font-semibold">{profile.rating}</span>
                                    <span className="text-muted-foreground">({profile.completedJobs} jobs)</span>
                                </div>
                                <div className="flex items-center justify-center mt-2">
                                    <Badge variant={profile.verified ? "default" : "secondary"}>
                                        {profile.verified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{profile.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{profile.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{profile.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{profile.experience}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Your personal and contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={profile.location}
                                            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={profile.phone}
                                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="serviceCategory">Service Category</Label>
                                        <Select
                                            value={profile.serviceCategory}
                                            onValueChange={(value) => setProfile(prev => ({ ...prev, serviceCategory: value }))}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="web-dev">Web Development</SelectItem>
                                                <SelectItem value="design">Graphic Design</SelectItem>
                                                <SelectItem value="events">Events & Weddings</SelectItem>
                                                <SelectItem value="writing">Content Writing</SelectItem>
                                                <SelectItem value="photography">Photography & Video</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        value={profile.bio}
                                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                                        disabled={!isEditing}
                                        rows={4}
                                        placeholder="Tell clients about yourself and your experience..."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Professional Details</CardTitle>
                                <CardDescription>Your rates, experience, and availability</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            value={profile.hourlyRate}
                                            onChange={(e) => setProfile(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input
                                            id="experience"
                                            value={profile.experience}
                                            onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="availability"
                                        checked={profile.availability}
                                        onCheckedChange={(checked) => setProfile(prev => ({ ...prev, availability: checked }))}
                                        disabled={!isEditing}
                                    />
                                    <Label htmlFor="availability">Available for new projects</Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills</CardTitle>
                                <CardDescription>Add your technical skills and expertise</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                            <span>{skill}</span>
                                            {isEditing && (
                                                <button
                                                    onClick={() => removeSkill(skill)}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </Badge>
                                    ))}
                                </div>
                                {isEditing && (
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Add a skill"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                        />
                                        <Button onClick={addSkill} size="sm">
                                            Add
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Portfolio */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Portfolio</CardTitle>
                                <CardDescription>Share links to your best work</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    {profile.portfolio.map((url, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                {url}
                                            </a>
                                            {isEditing && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePortfolio(url)}
                                                >
                                                    ×
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {isEditing && (
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Add portfolio URL"
                                            value={newPortfolio}
                                            onChange={(e) => setNewPortfolio(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolio())}
                                        />
                                        <Button onClick={addPortfolio} size="sm">
                                            Add
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
        </ProviderLayout>
    )
}

export default ProviderProfile
