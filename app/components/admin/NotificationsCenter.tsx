import React, { useState, useEffect } from 'react'
import { 
    Bell, 
    UserPlus, 
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { profileStorage, type UserProfile } from '~/lib/profile-storage'
import { supabase } from '~/lib/supabase.client'
import { Skeleton } from '~/components/ui/skeletons'

interface Notification {
    id: string
    type: 'user_signup' | 'verification_pending' | 'service_created' | 'booking_created'
    title: string
    message: string
    userId?: string
    user?: UserProfile
    read: boolean
    timestamp: string
    priority: 'low' | 'medium' | 'high'
}

const NotificationsCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNotifications()
        
        // Set up real-time subscription for new sign-ups
        const subscription = supabase
            .channel('admin-notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'user_profiles'
                },
                (payload) => {
                    console.log('New user signup notification:', payload)
                    loadNotifications()
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loadNotifications = async () => {
        setLoading(true)
        try {
            // Get all users
            const users = await profileStorage.getAll()
            
            // Get recent sign-ups (last 30 days)
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
            
            const recentSignUps = users
                .filter(u => new Date(u.createdAt) >= thirtyDaysAgo)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

            // Create notifications from sign-ups
            const newNotifications: Notification[] = recentSignUps.map((user, index) => ({
                id: `signup_${user.id}`,
                type: 'user_signup',
                title: `New ${user.userType} sign-up`,
                message: `${user.fullName} (${user.email}) just signed up`,
                userId: user.userId,
                user,
                read: index >= 5, // Mark older notifications as read
                timestamp: user.createdAt,
                priority: !user.verified ? 'high' : 'medium'
            }))

            // Add verification pending notifications
            const unverifiedUsers = users.filter(u => !u.verified && u.userType === 'provider')
            unverifiedUsers.forEach(user => {
                newNotifications.push({
                    id: `verify_${user.id}`,
                    type: 'verification_pending',
                    title: 'Verification Required',
                    message: `Provider ${user.fullName} needs verification`,
                    userId: user.userId,
                    user,
                    read: false,
                    timestamp: user.createdAt,
                    priority: 'high'
                })
            })

            // Sort by timestamp (newest first)
            newNotifications.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )

            setNotifications(newNotifications)
        } catch (error) {
            console.error('Error loading notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const markAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read
        if (filter === 'read') return n.read
        return true
    })

    const unreadCount = notifications.filter(n => !n.read).length

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'user_signup':
                return <UserPlus className="h-5 w-5 text-blue-600" />
            case 'verification_pending':
                return <AlertCircle className="h-5 w-5 text-yellow-600" />
            default:
                return <Bell className="h-5 w-5" />
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-red-200 bg-red-50 dark:bg-red-900/10'
            case 'medium':
                return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10'
            default:
                return ''
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Notifications Center</h2>
                    <p className="text-muted-foreground">
                        Stay updated with new sign-ups and platform activities.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-sm">
                            {unreadCount} unread
                        </Badge>
                    )}
                    <Button 
                        variant="outline" 
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                    >
                        Mark all as read
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{notifications.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unread</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{unreadCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">New Sign-ups (30 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {notifications.filter(n => n.type === 'user_signup').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Notifications</CardTitle>
                        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="read">Read</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`
                                        p-4 border rounded-lg transition-colors
                                        ${!notification.read ? getPriorityColor(notification.priority) : ''}
                                        ${notification.read ? 'opacity-60' : ''}
                                        hover:bg-muted/50
                                    `}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium">{notification.title}</h3>
                                                    {!notification.read && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            New
                                                        </Badge>
                                                    )}
                                                    <Badge 
                                                        variant={notification.priority === 'high' ? 'destructive' : 'outline'}
                                                        className="text-xs"
                                                    >
                                                        {notification.priority}
                                                    </Badge>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={notification.read ? 'opacity-50' : ''}
                                                >
                                                    {notification.read ? 'Read' : 'Mark as read'}
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {notification.message}
                                            </p>
                                            {notification.user && (
                                                <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                                                    <span>Email: {notification.user.email}</span>
                                                    {notification.user.location && (
                                                        <span>Location: {notification.user.location}</span>
                                                    )}
                                                </div>
                                            )}
                                            <div className="mt-2 flex items-center space-x-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {new Date(notification.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No notifications found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default NotificationsCenter

