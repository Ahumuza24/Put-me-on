import React from 'react'
import { Link } from '@remix-run/react'
import { 
    User, 
    Settings, 
    LogOut, 
    ChevronDown,
    MapPin,
    Briefcase
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import { useAuth } from '~/context/AuthContext'

interface UserAvatarProps {
    className?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ className }) => {
    const { user, profile, signOut } = useAuth()

    const handleSignOut = async () => {
        const { error } = await signOut()
        if (!error) {
            // Use window.location for a hard redirect to bypass route guards
            // This ensures we get to the landing page without ProtectedRoute interfering
            window.location.href = '/'
        }
    }

    // Get user initials from full name or email
    const getInitials = () => {
        if (profile?.fullName) {
            return profile.fullName
                .split(' ')
                .map(name => name.charAt(0))
                .join('')
                .toUpperCase()
                .slice(0, 2)
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase()
        }
        return 'U'
    }

    // Get display name
    const getDisplayName = () => {
        return profile?.fullName || user?.email?.split('@')[0] || 'User'
    }

    // Get user type display
    const getUserTypeDisplay = () => {
        if (profile?.userType) {
            return profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1)
        }
        return 'Provider'
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "flex items-center space-x-3 px-3 py-2 h-auto hover:bg-muted/50 transition-colors",
                        className
                    )}
                >
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                            <span className="text-sm font-semibold text-primary">
                                {getInitials()}
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">
                            {getDisplayName()}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {getUserTypeDisplay()}
                        </p>
                    </div>

                    {/* Chevron */}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                align="end" 
                className="w-80 p-2"
                sideOffset={8}
            >
                {/* User Info Header */}
                <div className="px-3 py-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                            <span className="text-lg font-semibold text-primary">
                                {getInitials()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                                {getDisplayName()}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                                {user?.email}
                            </p>
                            {profile?.location && (
                                <div className="flex items-center space-x-1 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground truncate">
                                        {profile.location}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                {/* Account Info */}
                <div className="px-3 py-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Account Type</span>
                        <span className="font-medium">{getUserTypeDisplay()}</span>
                    </div>
                    {profile?.serviceCategory && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Service Category</span>
                            <span className="font-medium capitalize">
                                {profile.serviceCategory.replace('-', ' ')}
                            </span>
                        </div>
                    )}
                    {profile?.verified !== undefined && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Status</span>
                            <span className={`font-medium ${profile.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                                {profile.verified ? 'Verified' : 'Pending Verification'}
                            </span>
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator />

                {/* Navigation Items */}
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-1">
                    Account Management
                </DropdownMenuLabel>
                
                <DropdownMenuItem asChild>
                    <Link to="/provider/profile" className="flex items-center space-x-2 px-3 py-2">
                        <User className="h-4 w-4" />
                        <span>Profile Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/provider/settings" className="flex items-center space-x-2 px-3 py-2">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/provider/services" className="flex items-center space-x-2 px-3 py-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Manage Services</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAvatar
