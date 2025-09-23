import React, { useState, useEffect } from 'react'
import { Link } from '@remix-run/react'
import { 
    User, 
    Briefcase, 
    Calendar, 
    DollarSign, 
    Star, 
    MessageSquare, 
    Settings, 
    Plus,
    TrendingUp,
    Eye,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import ProviderLayout from './ProviderLayout'
import UserAvatar from './UserAvatar'
import { useAuth } from '~/context/AuthContext'

interface ProviderDashboardProps {
    // No props needed - will use useAuth hook internally
}

interface DashboardStats {
    totalEarnings: number
    completedJobs: number
    activeJobs: number
    averageRating: number
    totalViews: number
    responseRate: number
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = () => {
    const { user, profile } = useAuth()
    const [stats, setStats] = useState<DashboardStats>({
        totalEarnings: 0,
        completedJobs: 0,
        activeJobs: 0,
        averageRating: 0,
        totalViews: 0,
        responseRate: 0
    })

    const [recentBookings, setRecentBookings] = useState([
        {
            id: 1,
            clientName: 'Sarah Johnson',
            service: 'Website Redesign',
            amount: 1200,
            status: 'in-progress',
            date: '2024-01-15'
        },
        {
            id: 2,
            clientName: 'Mike Chen',
            service: 'Logo Design',
            amount: 350,
            status: 'completed',
            date: '2024-01-12'
        },
        {
            id: 3,
            clientName: 'Emily Davis',
            service: 'Brand Identity',
            amount: 800,
            status: 'pending',
            date: '2024-01-18'
        }
    ])

    const [recentMessages, setRecentMessages] = useState([
        {
            id: 1,
            clientName: 'Sarah Johnson',
            message: 'Hi! I love the initial design concepts. When can we schedule a call?',
            time: '2 hours ago',
            unread: true
        },
        {
            id: 2,
            clientName: 'Mike Chen',
            message: 'The final logo looks perfect! Thank you so much.',
            time: '1 day ago',
            unread: false
        }
    ])

    // Mock data - in real app, this would come from API
    useEffect(() => {
        setStats({
            totalEarnings: 58596000,
            completedJobs: 47,
            activeJobs: 3,
            averageRating: 4.8,
            totalViews: 1234,
            responseRate: 95
        })
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }

    const actions = (
        <div className="flex items-center space-x-4">
            <Button asChild>
                <Link to="/provider/services">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                </Link>
            </Button>
            <UserAvatar />
        </div>
    )

    return (
        <ProviderLayout
            title="Provider Dashboard"
            description={`Welcome back, ${profile?.fullName || user?.email}${profile?.location ? ` from ${profile.location}` : ''}`}
            actions={actions}
        >

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">UGX {stats.totalEarnings.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    +12% from last month
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completedJobs}</div>
                                <p className="text-xs text-muted-foreground">
                                    +3 this week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeJobs}</div>
                                <p className="text-xs text-muted-foreground">
                                    In progress
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.averageRating}</div>
                                <p className="text-xs text-muted-foreground">
                                    Based on {stats.completedJobs} reviews
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Bookings</CardTitle>
                                <CardDescription>
                                    Your latest client requests and bookings
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="space-y-1">
                                                <p className="font-medium">{booking.clientName}</p>
                                                <p className="text-sm text-muted-foreground">{booking.service}</p>
                                                <p className="text-xs text-muted-foreground">{booking.date}</p>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <p className="font-semibold">${booking.amount}</p>
                                                <Badge className={getStatusColor(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <Link to="/provider/bookings">View All Bookings</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Messages */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Messages</CardTitle>
                                <CardDescription>
                                    Latest conversations with clients
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentMessages.map((message) => (
                                        <div key={message.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <MessageSquare className="h-4 w-4 text-primary" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-sm">{message.clientName}</p>
                                                    <p className="text-xs text-muted-foreground">{message.time}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 truncate">
                                                    {message.message}
                                                </p>
                                            </div>
                                            {message.unread && (
                                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    View All Messages
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button variant="outline" className="h-20 flex-col" asChild>
                                    <Link to="/provider/services">
                                        <Plus className="h-6 w-6 mb-2" />
                                        Add New Service
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col" asChild>
                                    <Link to="/provider/profile">
                                        <User className="h-6 w-6 mb-2" />
                                        Update Profile
                                    </Link>
                                </Button>
                                <Button variant="outline" className="h-20 flex-col">
                                    <TrendingUp className="h-6 w-6 mb-2" />
                                    View Analytics
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
        </ProviderLayout>
    )
}

export default ProviderDashboard
