import React, { useState, useEffect } from 'react'
import { 
    Users, 
    Search, 
    Filter, 
    MoreVertical,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    User as UserIcon,
    Briefcase
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

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserProfile[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'client' | 'provider' | 'admin'>('all')
    const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all')

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchTerm, filterType, filterVerified])

    const loadUsers = async () => {
        setLoading(true)
        try {
            const allUsers = await profileStorage.getAll()
            setUsers(allUsers)
        } catch (error) {
            console.error('Error loading users:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterUsers = () => {
        let filtered = [...users]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.location?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by user type
        if (filterType !== 'all') {
            filtered = filtered.filter(user => user.userType === filterType)
        }

        // Filter by verification status
        if (filterVerified === 'verified') {
            filtered = filtered.filter(user => user.verified)
        } else if (filterVerified === 'unverified') {
            filtered = filtered.filter(user => !user.verified)
        }

        setFilteredUsers(filtered)
    }

    const handleVerifyUser = async (userId: string) => {
        try {
            await profileStorage.update(userId, { verified: true })
            await loadUsers()
        } catch (error) {
            console.error('Error verifying user:', error)
        }
    }

    const handleUnverifyUser = async (userId: string) => {
        try {
            await profileStorage.update(userId, { verified: false })
            await loadUsers()
        } catch (error) {
            console.error('Error unverifying user:', error)
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await profileStorage.delete(userId)
                await loadUsers()
            } catch (error) {
                console.error('Error deleting user:', error)
            }
        }
    }

    const getUserTypeIcon = (userType: string) => {
        switch (userType) {
            case 'provider':
                return <Briefcase className="h-4 w-4" />
            case 'admin':
            case 'super_admin':
                return <Shield className="h-4 w-4" />
            default:
                return <UserIcon className="h-4 w-4" />
        }
    }

    const getUserTypeColor = (userType: string) => {
        switch (userType) {
            case 'provider':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            case 'admin':
            case 'super_admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
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
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">User Management</h2>
                <p className="text-muted-foreground">
                    Manage all users, verify accounts, and monitor user activity.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.userType === 'client').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Providers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {users.filter(u => u.userType === 'provider').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Unverified</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {users.filter(u => !u.verified).length}
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
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="User Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="client">Clients</SelectItem>
                                <SelectItem value="provider">Providers</SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterVerified} onValueChange={(value: any) => setFilterVerified(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Verification" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        {getUserTypeIcon(user.userType)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium truncate">{user.fullName}</p>
                                            <Badge className={getUserTypeColor(user.userType)}>
                                                {user.userType}
                                            </Badge>
                                            {user.verified ? (
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
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <Mail className="h-3 w-3" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center space-x-1">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{user.phone}</span>
                                                </div>
                                            )}
                                            {user.location && (
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{user.location}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {!user.verified && (
                                            <DropdownMenuItem onClick={() => handleVerifyUser(user.userId)}>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Verify User
                                            </DropdownMenuItem>
                                        )}
                                        {user.verified && (
                                            <DropdownMenuItem onClick={() => handleUnverifyUser(user.userId)}>
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Unverify User
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => handleDeleteUser(user.userId)}
                                            className="text-destructive"
                                        >
                                            Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                        {filteredUsers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No users found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UserManagement

