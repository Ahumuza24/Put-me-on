import React, { useState, useEffect } from 'react'
import { 
    Briefcase, 
    Search, 
    Filter,
    CheckCircle,
    XCircle,
    Shield,
    Star,
    User,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    AlertCircle
} from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '~/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { profileStorage, type UserProfile } from '~/lib/profile-storage'
import { servicesStorage } from '~/lib/services-storage'
import { StatsCardSkeleton, TableSkeleton, Skeleton } from '~/components/ui/skeletons'

const AdminProviderManagement: React.FC = () => {
    const [providers, setProviders] = useState<UserProfile[]>([])
    const [filteredProviders, setFilteredProviders] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all')
    const [providerServices, setProviderServices] = useState<Record<string, number>>({})

    useEffect(() => {
        loadProviders()
    }, [])

    useEffect(() => {
        filterProviders()
    }, [providers, searchTerm, filterVerified])

    const loadProviders = async () => {
        setLoading(true)
        try {
            const allProfiles = await profileStorage.getAll()
            const providerList = allProfiles.filter(p => p.userType === 'provider')
            setProviders(providerList)

            // Load service counts for each provider
            const serviceCounts: Record<string, number> = {}
            for (const provider of providerList) {
                try {
                    const services = await servicesStorage.getByProvider(provider.userId)
                    serviceCounts[provider.userId] = services.length
                } catch (error) {
                    serviceCounts[provider.userId] = 0
                }
            }
            setProviderServices(serviceCounts)
        } catch (error) {
            console.error('Error loading providers:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterProviders = () => {
        let filtered = [...providers]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(provider =>
                provider.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.location?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by verification
        if (filterVerified === 'verified') {
            filtered = filtered.filter(provider => provider.verified)
        } else if (filterVerified === 'unverified') {
            filtered = filtered.filter(provider => !provider.verified)
        }

        setFilteredProviders(filtered)
    }

    const handleVerifyProvider = async (userId: string) => {
        try {
            await profileStorage.update(userId, { verified: true })
            await loadProviders()
        } catch (error) {
            console.error('Error verifying provider:', error)
        }
    }

    const handleUnverifyProvider = async (userId: string) => {
        try {
            await profileStorage.update(userId, { verified: false })
            await loadProviders()
        } catch (error) {
            console.error('Error unverifying provider:', error)
        }
    }

    const handleSuspendProvider = async (userId: string) => {
        if (window.confirm('Are you sure you want to suspend this provider? They will not be able to access their account.')) {
            try {
                // In a real app, you'd have a suspend/ban mechanism
                // For now, we'll just update the profile
                await profileStorage.update(userId, { verified: false })
                await loadProviders()
            } catch (error) {
                console.error('Error suspending provider:', error)
            }
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <StatsCardSkeleton key={i} />
                    ))}
                </div>
                <TableSkeleton rows={8} columns={6} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Provider Management</h2>
                <p className="text-muted-foreground">
                    Manage service providers, verify accounts, and monitor provider activity.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{providers.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Verified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {providers.filter(p => p.verified).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unverified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {providers.filter(p => !p.verified).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Object.values(providerServices).reduce((sum, count) => sum + count, 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search providers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={filterVerified} onValueChange={(value: any) => setFilterVerified(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Providers</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Providers List */}
            <Card>
                <CardHeader>
                    <CardTitle>Providers ({filteredProviders.length})</CardTitle>
                    <CardDescription>Manage provider accounts and verification</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredProviders.map((provider) => (
                            <div
                                key={provider.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className="font-medium truncate">{provider.fullName}</p>
                                            {provider.verified ? (
                                                <Badge variant="outline" className="text-green-600 border-green-600">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Unverified
                                                </Badge>
                                            )}
                                            {provider.rating && provider.rating > 0 && (
                                                <Badge variant="secondary">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    {provider.rating.toFixed(1)}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{provider.email}</span>
                                            </div>
                                            {provider.phone && (
                                                <div className="flex items-center space-x-1">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{provider.phone}</span>
                                                </div>
                                            )}
                                            {provider.location && (
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{provider.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-1">
                                                <Briefcase className="h-3 w-3" />
                                                <span>{providerServices[provider.userId] || 0} services</span>
                                            </div>
                                            {provider.completedJobs !== undefined && (
                                                <div className="flex items-center space-x-1">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>{provider.completedJobs} jobs completed</span>
                                                </div>
                                            )}
                                        </div>
                                        {provider.bio && (
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {provider.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {!provider.verified && (
                                            <DropdownMenuItem onClick={() => handleVerifyProvider(provider.userId)}>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Verify Provider
                                            </DropdownMenuItem>
                                        )}
                                        {provider.verified && (
                                            <DropdownMenuItem onClick={() => handleUnverifyProvider(provider.userId)}>
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Unverify Provider
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleSuspendProvider(provider.userId)}>
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Suspend Provider
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                        {filteredProviders.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No providers found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminProviderManagement

