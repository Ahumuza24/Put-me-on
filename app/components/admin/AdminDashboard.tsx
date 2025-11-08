import React, { useState, useEffect } from 'react'
import { 
    Users, 
    Briefcase, 
    DollarSign, 
    TrendingUp, 
    Activity,
    UserPlus,
    AlertCircle,
    ArrowUp,
    ArrowDown,
    Calendar,
    MessageSquare,
    CheckCircle,
    XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { useAuth } from '~/context/AuthContext'
import { profileStorage, type UserProfile } from '~/lib/profile-storage'
import { servicesStorage, type Service } from '~/lib/services-storage'
import { bookingsStorage, type Booking } from '~/lib/bookings-storage'
import { supabase } from '~/lib/supabase.client'

interface DashboardStats {
    totalUsers: number
    totalProviders: number
    totalClients: number
    totalServices: number
    totalBookings: number
    activeBookings: number
    completedBookings: number
    totalEarnings: number
    monthlyEarnings: number
    newUsersToday: number
    newUsersThisWeek: number
    newUsersThisMonth: number
    pendingVerifications: number
    activeServices: number
}

interface RecentActivity {
    id: string
    type: 'user_signup' | 'service_created' | 'booking_created' | 'payment_received'
    message: string
    timestamp: string
    user?: {
        name: string
        email: string
    }
}

const AdminDashboard: React.FC = () => {
    const { user, profile } = useAuth()
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalProviders: 0,
        totalClients: 0,
        totalServices: 0,
        totalBookings: 0,
        activeBookings: 0,
        completedBookings: 0,
        totalEarnings: 0,
        monthlyEarnings: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0,
        pendingVerifications: 0,
        activeServices: 0
    })
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [newSignUps, setNewSignUps] = useState<UserProfile[]>([])

    useEffect(() => {
        loadDashboardData()
        
        // Set up real-time subscription for new sign-ups
        const subscription = supabase
            .channel('new-signups')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_profiles'
                },
                (payload) => {
                    console.log('New user signup detected:', payload)
                    loadDashboardData()
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loadDashboardData = async () => {
        setLoading(true)
        try {
            // Load all profiles
            const profiles = await profileStorage.getAll()
            
            // Calculate user stats
            const providers = profiles.filter(p => p.userType === 'provider')
            const clients = profiles.filter(p => p.userType === 'client')
            const admins = profiles.filter(p => p.userType === 'admin' || p.userType === 'super_admin')
            
            // Get new sign-ups (last 7 days)
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            const newSignUpsList = profiles.filter(p => 
                new Date(p.createdAt) >= sevenDaysAgo
            ).sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            setNewSignUps(newSignUpsList)

            // Get today's date range
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todayEnd = new Date(today)
            todayEnd.setHours(23, 59, 59, 999)

            // Get this week's date range
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)

            // Get this month's date range
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)

            const newUsersToday = profiles.filter(p => {
                const created = new Date(p.createdAt)
                return created >= today && created <= todayEnd
            }).length

            const newUsersThisWeek = profiles.filter(p => {
                const created = new Date(p.createdAt)
                return created >= weekAgo
            }).length

            const newUsersThisMonth = profiles.filter(p => {
                const created = new Date(p.createdAt)
                return created >= monthAgo
            }).length

            // Load services (mock data for now - you'll need to implement getAll services)
            const services: Service[] = [] // TODO: Implement servicesStorage.getAll()
            const activeServices = services.filter(s => s.isActive).length

            // Load bookings (mock data for now)
            const bookings: Booking[] = [] // TODO: Implement bookingsStorage.getAll()
            const activeBookings = bookings.filter(b => 
                ['pending', 'accepted', 'in_progress'].includes(b.status)
            ).length
            const completedBookings = bookings.filter(b => b.status === 'completed').length

            // Calculate earnings (mock - you'll need to implement payment tracking)
            const totalEarnings = 0 // TODO: Calculate from bookings
            const monthlyEarnings = 0 // TODO: Calculate from bookings this month

            // Pending verifications
            const pendingVerifications = profiles.filter(p => !p.verified).length

            setStats({
                totalUsers: profiles.length,
                totalProviders: providers.length,
                totalClients: clients.length,
                totalServices: services.length,
                totalBookings: bookings.length,
                activeBookings,
                completedBookings,
                totalEarnings,
                monthlyEarnings,
                newUsersToday,
                newUsersThisWeek,
                newUsersThisMonth,
                pendingVerifications,
                activeServices
            })

            // Generate recent activity
            const activities: RecentActivity[] = []
            
            // Add new sign-ups as activities
            newSignUpsList.slice(0, 10).forEach(profile => {
                activities.push({
                    id: `signup_${profile.id}`,
                    type: 'user_signup',
                    message: `${profile.userType === 'provider' ? 'Provider' : 'Client'} ${profile.fullName} signed up`,
                    timestamp: profile.createdAt,
                    user: {
                        name: profile.fullName,
                        email: profile.email
                    }
                })
            })

            // Sort by timestamp
            activities.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )

            setRecentActivity(activities.slice(0, 20))
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {profile?.fullName || 'Admin'}!
                </h2>
                <p className="text-muted-foreground">
                    Here's what's happening with your platform today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">{stats.newUsersThisMonth}</span> new this month
                        </p>
                    </CardContent>
                </Card>

                {/* Providers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Providers
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProviders}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeServices} active services
                        </p>
                    </CardContent>
                </Card>

                {/* Clients */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Clients
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalClients}</div>
                        <p className="text-xs text-muted-foreground">
                            Active customers
                        </p>
                    </CardContent>
                </Card>

                {/* Total Earnings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Earnings
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            UGX {stats.totalEarnings.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-green-600">
                                UGX {stats.monthlyEarnings.toLocaleString()}
                            </span> this month
                        </p>
                    </CardContent>
                </Card>

                {/* Total Services */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Services
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalServices}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeServices} active
                        </p>
                    </CardContent>
                </Card>

                {/* Total Bookings */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBookings}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.activeBookings} active, {stats.completedBookings} completed
                        </p>
                    </CardContent>
                </Card>

                {/* New Sign-ups Today */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            New Sign-ups
                        </CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.newUsersToday}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.newUsersThisWeek} this week
                        </p>
                    </CardContent>
                </Card>

                {/* Pending Verifications */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Verifications
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.pendingVerifications}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Require attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* New Sign-ups Alert */}
            {newSignUps.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                <CardTitle className="text-lg">New Sign-ups (Last 7 Days)</CardTitle>
                            </div>
                            <Badge variant="secondary">{newSignUps.length} new users</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {newSignUps.slice(0, 5).map((user) => (
                                <div 
                                    key={user.id}
                                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{user.fullName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email} • {user.userType}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant={user.userType === 'provider' ? 'default' : 'secondary'}>
                                            {user.userType}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {newSignUps.length > 5 && (
                                <p className="text-sm text-muted-foreground text-center">
                                    +{newSignUps.length - 5} more sign-ups
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest platform activities and events</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div 
                                    key={activity.id}
                                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="mt-1">
                                        {activity.type === 'user_signup' && (
                                            <UserPlus className="h-5 w-5 text-green-600" />
                                        )}
                                        {activity.type === 'service_created' && (
                                            <Briefcase className="h-5 w-5 text-blue-600" />
                                        )}
                                        {activity.type === 'booking_created' && (
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                        )}
                                        {activity.type === 'payment_received' && (
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">{activity.message}</p>
                                        {activity.user && (
                                            <p className="text-xs text-muted-foreground">
                                                {activity.user.email}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                No recent activity
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboard

