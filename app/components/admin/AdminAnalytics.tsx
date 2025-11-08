import React, { useState, useEffect } from 'react'
import { 
    BarChart3, 
    TrendingUp,
    Users,
    Briefcase,
    DollarSign,
    Calendar,
    Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { profileStorage, type UserProfile } from '~/lib/profile-storage'
import { servicesStorage, type Service } from '~/lib/services-storage'
import { bookingsStorage, type Booking } from '~/lib/bookings-storage'
import { StatsCardSkeleton, Skeleton } from '~/components/ui/skeletons'

interface AnalyticsData {
    userGrowth: Array<{ month: string; users: number; providers: number; clients: number }>
    revenueTrend: Array<{ month: string; revenue: number; fees: number }>
    serviceCategories: Array<{ category: string; count: number }>
    bookingStatusDistribution: Array<{ status: string; count: number }>
    topProviders: Array<{ name: string; services: number; bookings: number; rating: number }>
    activityTrend: Array<{ date: string; bookings: number; signups: number }>
}

const AdminAnalytics: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y' | 'all'>('90d')

    useEffect(() => {
        loadAnalytics()
    }, [timeRange])

    const loadAnalytics = async () => {
        setLoading(true)
        try {
            const [profiles, services, bookings] = await Promise.all([
                profileStorage.getAll(),
                servicesStorage.getAll(),
                bookingsStorage.getAll()
            ])

            // Calculate date range
            const now = new Date()
            const dateFilter = new Date()
            if (timeRange === '30d') dateFilter.setDate(now.getDate() - 30)
            else if (timeRange === '90d') dateFilter.setDate(now.getDate() - 90)
            else if (timeRange === '1y') dateFilter.setFullYear(now.getFullYear() - 1)

            const filteredProfiles = timeRange === 'all' 
                ? profiles 
                : profiles.filter(p => new Date(p.createdAt) >= dateFilter)
            const filteredBookings = timeRange === 'all'
                ? bookings
                : bookings.filter(b => new Date(b.createdAt) >= dateFilter)

            // User Growth (last 6 months)
            const userGrowth: Array<{ month: string; users: number; providers: number; clients: number }> = []
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
                const monthProfiles = filteredProfiles.filter(p => {
                    const date = new Date(p.createdAt)
                    return date >= monthStart && date <= monthEnd
                })
                userGrowth.push({
                    month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    users: monthProfiles.length,
                    providers: monthProfiles.filter(p => p.userType === 'provider').length,
                    clients: monthProfiles.filter(p => p.userType === 'client').length
                })
            }

            // Revenue Trend
            const revenueTrend: Array<{ month: string; revenue: number; fees: number }> = []
            const completedBookings = filteredBookings.filter(b => b.status === 'completed')
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
                const monthBookings = completedBookings.filter(b => {
                    const date = new Date(b.createdAt)
                    return date >= monthStart && date <= monthEnd
                })
                const revenue = monthBookings.reduce((sum, b) => sum + b.budget, 0)
                revenueTrend.push({
                    month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    revenue,
                    fees: revenue * 0.10
                })
            }

            // Service Categories
            const categoryCount: Record<string, number> = {}
            services.forEach(service => {
                const category = service.categoryName || 'Uncategorized'
                categoryCount[category] = (categoryCount[category] || 0) + 1
            })
            const serviceCategories = Object.entries(categoryCount)
                .map(([category, count]) => ({ category, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)

            // Booking Status Distribution
            const statusCount: Record<string, number> = {}
            filteredBookings.forEach(booking => {
                statusCount[booking.status] = (statusCount[booking.status] || 0) + 1
            })
            const bookingStatusDistribution = Object.entries(statusCount)
                .map(([status, count]) => ({ status, count }))

            // Top Providers
            const providerStats: Record<string, { name: string; services: number; bookings: number; rating: number }> = {}
            const providers = profiles.filter(p => p.userType === 'provider')
            providers.forEach(provider => {
                const providerServices = services.filter(s => s.providerId === provider.userId)
                const providerBookings = filteredBookings.filter(b => b.providerId === provider.userId)
                providerStats[provider.userId] = {
                    name: provider.fullName,
                    services: providerServices.length,
                    bookings: providerBookings.length,
                    rating: provider.rating || 0
                }
            })
            const topProviders = Object.values(providerStats)
                .sort((a, b) => b.bookings - a.bookings)
                .slice(0, 10)

            // Activity Trend (last 30 days)
            const activityTrend: Array<{ date: string; bookings: number; signups: number }> = []
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                date.setHours(0, 0, 0, 0)
                const nextDate = new Date(date)
                nextDate.setDate(nextDate.getDate() + 1)
                
                const dayBookings = filteredBookings.filter(b => {
                    const bookingDate = new Date(b.createdAt)
                    return bookingDate >= date && bookingDate < nextDate
                }).length
                
                const daySignups = filteredProfiles.filter(p => {
                    const signupDate = new Date(p.createdAt)
                    return signupDate >= date && signupDate < nextDate
                }).length

                activityTrend.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    bookings: dayBookings,
                    signups: daySignups
                })
            }

            setAnalytics({
                userGrowth,
                revenueTrend,
                serviceCategories,
                bookingStatusDistribution,
                topProviders,
                activityTrend
            })
        } catch (error) {
            console.error('Error loading analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return `UGX ${amount.toLocaleString()}`
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!analytics) {
        return <div>No analytics data available</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Analytics & Insights</h2>
                    <p className="text-muted-foreground">
                        Comprehensive platform analytics and performance metrics.
                    </p>
                </div>
                <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* User Growth Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.userGrowth.map((data, index) => {
                            const maxUsers = Math.max(...analytics.userGrowth.map(d => d.users))
                            const usersPercentage = maxUsers > 0 ? (data.users / maxUsers) * 100 : 0
                            const providersPercentage = maxUsers > 0 ? (data.providers / maxUsers) * 100 : 0
                            const clientsPercentage = maxUsers > 0 ? (data.clients / maxUsers) * 100 : 0

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{data.month}</span>
                                        <div className="flex items-center space-x-4">
                                            <span>Total: {data.users}</span>
                                            <span className="text-blue-600">Providers: {data.providers}</span>
                                            <span className="text-green-600">Clients: {data.clients}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-8 relative overflow-hidden">
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-blue-600"
                                            style={{ width: `${providersPercentage}%` }}
                                        />
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-green-600"
                                            style={{ width: `${clientsPercentage}%`, marginLeft: `${providersPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Platform revenue and fees over time</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.revenueTrend.map((data, index) => {
                            const maxRevenue = Math.max(...analytics.revenueTrend.map(d => d.revenue))
                            const revenuePercentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0
                            const feesPercentage = maxRevenue > 0 ? (data.fees / maxRevenue) * 100 : 0

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{data.month}</span>
                                        <div className="flex items-center space-x-4">
                                            <span>Revenue: {formatCurrency(data.revenue)}</span>
                                            <span className="text-primary">Fees: {formatCurrency(data.fees)}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-8 relative overflow-hidden">
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-primary/20"
                                            style={{ width: `${revenuePercentage}%` }}
                                        />
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-primary"
                                            style={{ width: `${feesPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Service Categories and Booking Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Service Categories</CardTitle>
                        <CardDescription>Most popular service categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.serviceCategories.map((item, index) => {
                                const maxCount = Math.max(...analytics.serviceCategories.map(i => i.count))
                                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0

                                return (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{item.category}</span>
                                            <span className="font-medium">{item.count}</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div 
                                                className="bg-primary h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Booking Status Distribution</CardTitle>
                        <CardDescription>Current booking statuses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {analytics.bookingStatusDistribution.map((item, index) => {
                                const total = analytics.bookingStatusDistribution.reduce((sum, i) => sum + i.count, 0)
                                const percentage = total > 0 ? (item.count / total) * 100 : 0

                                return (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="capitalize">{item.status.replace('_', ' ')}</span>
                                            <span className="font-medium">{item.count} ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div 
                                                className="bg-primary h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Providers */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Providers</CardTitle>
                    <CardDescription>Most active providers on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.topProviders.map((provider, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{provider.name}</p>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                            <span>{provider.services} services</span>
                                            <span>{provider.bookings} bookings</span>
                                            {provider.rating > 0 && (
                                                <span className="flex items-center">
                                                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                                    {provider.rating.toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Activity Trend */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Activity Trend</CardTitle>
                    <CardDescription>Bookings and sign-ups over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {analytics.activityTrend.map((data, index) => {
                            const maxActivity = Math.max(
                                ...analytics.activityTrend.map(d => Math.max(d.bookings, d.signups))
                            )
                            const bookingsPercentage = maxActivity > 0 ? (data.bookings / maxActivity) * 100 : 0
                            const signupsPercentage = maxActivity > 0 ? (data.signups / maxActivity) * 100 : 0

                            return (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="w-20 text-xs text-muted-foreground">{data.date}</div>
                                    <div className="flex-1 flex items-center space-x-2">
                                        <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                                            <div 
                                                className="absolute left-0 top-0 h-full bg-blue-600"
                                                style={{ width: `${bookingsPercentage}%` }}
                                                title={`${data.bookings} bookings`}
                                            />
                                            <div 
                                                className="absolute left-0 top-0 h-full bg-green-600 opacity-70"
                                                style={{ width: `${signupsPercentage}%`, marginLeft: `${bookingsPercentage}%` }}
                                                title={`${data.signups} signups`}
                                            />
                                        </div>
                                        <div className="w-24 text-xs text-muted-foreground text-right">
                                            {data.bookings} bookings, {data.signups} signups
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminAnalytics

