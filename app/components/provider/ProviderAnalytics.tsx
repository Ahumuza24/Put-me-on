import React, { useState, useEffect } from 'react'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Eye,
    MessageSquare,
    Star,
    Calendar,
    DollarSign,
    Clock,
    Target,
    Award,
    Download,
    Filter,
    RefreshCw
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Progress } from '~/components/ui/progress'
import ProviderLayout from './ProviderLayout'
import UserAvatar from './UserAvatar'
import { useAuth } from '~/context/AuthContext'
import { StatsCardSkeleton, Skeleton } from '~/components/ui/skeletons'

interface ProviderAnalyticsProps {
    // No props needed - will use useAuth hook internally
}

interface AnalyticsData {
    overview: {
        totalViews: number
        totalInquiries: number
        conversionRate: number
        averageRating: number
        responseTime: string
        completionRate: number
    }
    revenue: {
        currentMonth: number
        lastMonth: number
        growth: number
        totalEarnings: number
    }
    performance: {
        profileViews: Array<{ date: string; views: number }>
        inquiries: Array<{ date: string; count: number }>
        ratings: Array<{ date: string; rating: number }>
    }
    topServices: Array<{
        id: string
        name: string
        views: number
        inquiries: number
        revenue: number
    }>
    recentActivity: Array<{
        id: string
        type: 'view' | 'inquiry' | 'rating' | 'booking'
        description: string
        timestamp: string
        value?: number
    }>
}

const ProviderAnalytics: React.FC<ProviderAnalyticsProps> = () => {
    const { user, profile } = useAuth()
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [timeRange, setTimeRange] = useState('30d')
    const [isLoading, setIsLoading] = useState(true)

    // Mock data - replace with actual API calls
    useEffect(() => {
        const loadAnalyticsData = async () => {
            setIsLoading(true)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setAnalyticsData({
                overview: {
                    totalViews: 1247,
                    totalInquiries: 89,
                    conversionRate: 7.1,
                    averageRating: 4.8,
                    responseTime: '2.3 hours',
                    completionRate: 96.2
                },
                revenue: {
                    currentMonth: 33250000,
                    lastMonth: 27360000,
                    growth: 21.5,
                    totalEarnings: 173280000
                },
                performance: {
                    profileViews: [
                        { date: '2024-01-01', views: 45 },
                        { date: '2024-01-02', views: 52 },
                        { date: '2024-01-03', views: 38 },
                        { date: '2024-01-04', views: 61 },
                        { date: '2024-01-05', views: 47 },
                        { date: '2024-01-06', views: 55 },
                        { date: '2024-01-07', views: 42 }
                    ],
                    inquiries: [
                        { date: '2024-01-01', count: 3 },
                        { date: '2024-01-02', count: 5 },
                        { date: '2024-01-03', count: 2 },
                        { date: '2024-01-04', count: 7 },
                        { date: '2024-01-05', count: 4 },
                        { date: '2024-01-06', count: 6 },
                        { date: '2024-01-07', count: 3 }
                    ],
                    ratings: [
                        { date: '2024-01-01', rating: 4.5 },
                        { date: '2024-01-02', rating: 4.8 },
                        { date: '2024-01-03', rating: 4.2 },
                        { date: '2024-01-04', rating: 5.0 },
                        { date: '2024-01-05', rating: 4.7 },
                        { date: '2024-01-06', rating: 4.9 },
                        { date: '2024-01-07', rating: 4.6 }
                    ]
                },
                topServices: [
                    {
                        id: '1',
                        name: 'Website Development',
                        views: 456,
                        inquiries: 23,
                        revenue: 47500000
                    },
                    {
                        id: '2',
                        name: 'Mobile App Development',
                        views: 389,
                        inquiries: 18,
                        revenue: 37240000
                    },
                    {
                        id: '3',
                        name: 'UI/UX Design',
                        views: 312,
                        inquiries: 15,
                        revenue: 27360000
                    },
                    {
                        id: '4',
                        name: 'Consulting',
                        views: 234,
                        inquiries: 12,
                        revenue: 18240000
                    }
                ],
                recentActivity: [
                    {
                        id: '1',
                        type: 'view',
                        description: 'Profile viewed by Nakato Mbabazi',
                        timestamp: '2 minutes ago'
                    },
                    {
                        id: '2',
                        type: 'inquiry',
                        description: 'New inquiry for Website Development',
                        timestamp: '15 minutes ago',
                        value: 9500000
                    },
                    {
                        id: '3',
                        type: 'rating',
                        description: 'Received 5-star rating from Kato Ssemwogerere',
                        timestamp: '1 hour ago',
                        value: 5
                    },
                    {
                        id: '4',
                        type: 'booking',
                        description: 'New booking confirmed for Mobile App Development',
                        timestamp: '2 hours ago',
                        value: 13300000
                    },
                    {
                        id: '5',
                        type: 'view',
                        description: 'Profile viewed by Namukasa Nalubega',
                        timestamp: '3 hours ago'
                    }
                ]
            })
            
            setIsLoading(false)
        }

        loadAnalyticsData()
    }, [timeRange])

    const handleRefresh = () => {
        setIsLoading(true)
        // Simulate refresh
        setTimeout(() => setIsLoading(false), 1000)
    }

    const actions = (
        <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
            <UserAvatar />
        </div>
    )

    if (isLoading) {
        return (
            <ProviderLayout
                title="Analytics"
                description="Track your performance and growth"
                actions={actions}
            >
                <div className="space-y-6">
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
            </ProviderLayout>
        )
    }

    if (!analyticsData) {
        return (
            <ProviderLayout
                title="Analytics"
                description="Track your performance and growth"
                actions={actions}
            >
                <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No analytics data available</h3>
                    <p className="text-muted-foreground">
                        Start offering services to see your analytics here
                    </p>
                </div>
            </ProviderLayout>
        )
    }

    return (
        <ProviderLayout
            title="Analytics"
            description="Track your performance and growth"
            actions={actions}
        >
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                                    <p className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +12.5% from last month
                                    </p>
                                </div>
                                <Eye className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Inquiries</p>
                                    <p className="text-2xl font-bold">{analyticsData.overview.totalInquiries}</p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +8.2% from last month
                                    </p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                                    <p className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +1.2% from last month
                                    </p>
                                </div>
                                <Target className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                                    <p className="text-2xl font-bold">{analyticsData.overview.averageRating}</p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <Star className="h-3 w-3 mr-1" />
                                        +0.2 from last month
                                    </p>
                                </div>
                                <Star className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Revenue and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Card */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Revenue Overview
                            </CardTitle>
                            <CardDescription>
                                Your earnings for the current period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">This Month</span>
                                    <span className="text-2xl font-bold">
                                        UGX {analyticsData.revenue.currentMonth.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Last Month</span>
                                    <span className="text-lg">
                                        UGX {analyticsData.revenue.lastMonth.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Growth</span>
                                    <Badge variant="secondary" className="text-green-600">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +{analyticsData.revenue.growth}%
                                    </Badge>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Total Earnings</span>
                                        <span className="text-sm text-muted-foreground">All Time</span>
                                    </div>
                                    <p className="text-3xl font-bold">
                                        UGX {analyticsData.revenue.totalEarnings.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Metrics */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Performance Metrics
                            </CardTitle>
                            <CardDescription>
                                Key performance indicators
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Response Time</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analyticsData.overview.responseTime}
                                        </span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Completion Rate</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analyticsData.overview.completionRate}%
                                        </span>
                                    </div>
                                    <Progress value={analyticsData.overview.completionRate} className="h-2" />
                                </div>
                                
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Client Satisfaction</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analyticsData.overview.averageRating}/5.0
                                        </span>
                                    </div>
                                    <Progress value={(analyticsData.overview.averageRating / 5) * 100} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Top Services and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Services */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performing Services</CardTitle>
                            <CardDescription>
                                Your most popular services by views and revenue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.topServices.map((service, index) => (
                                    <div key={service.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-primary">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{service.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {service.views} views • {service.inquiries} inquiries
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">UGX {service.revenue.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">revenue</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest interactions and updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            activity.type === 'view' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'inquiry' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'rating' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                            {activity.type === 'view' && <Eye className="h-4 w-4" />}
                                            {activity.type === 'inquiry' && <MessageSquare className="h-4 w-4" />}
                                            {activity.type === 'rating' && <Star className="h-4 w-4" />}
                                            {activity.type === 'booking' && <Calendar className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">{activity.description}</p>
                                            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                            {activity.value && (
                                                <Badge variant="outline" className="mt-1">
                                                    {activity.type === 'rating' ? `${activity.value} stars` : `UGX ${activity.value.toLocaleString()}`}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProviderLayout>
    )
}

export default ProviderAnalytics
