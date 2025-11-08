import React from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { 
    Settings, 
    LogOut, 
    ChevronDown,
    User
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

interface NavbarUserAvatarProps {
    className?: string
}

const NavbarUserAvatar: React.FC<NavbarUserAvatarProps> = ({ className }) => {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            const { error } = await signOut()
            if (error) {
                console.error('Error signing out:', error)
                alert('Failed to sign out. Please try again.')
                return
            }
            
            // Clear any cached data
            if (typeof window !== 'undefined') {
                localStorage.removeItem('sb-auth-token')
                Object.keys(localStorage).forEach(key => {
                    if (key.includes('supabase') || key.includes('auth')) {
                        localStorage.removeItem(key)
                    }
                })
                sessionStorage.clear()
            }
            
            // Redirect to landing page
            window.location.href = '/'
        } catch (error) {
            console.error('Error signing out:', error)
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

    // Show login/signup buttons if not authenticated
    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                >
                    Sign In
                </Button>
                <Button
                    size="sm"
                    onClick={() => navigate('/signup')}
                >
                    Get Started
                </Button>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 h-auto hover:bg-muted/50 transition-colors",
                        className
                    )}
                >
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                            <span className="text-xs sm:text-sm font-semibold text-primary">
                                {getInitials()}
                            </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>

                    {/* User Info - Show on larger screens */}
                    <div className="hidden sm:block text-left min-w-0">
                        <p className="text-sm font-medium truncate">
                            {getDisplayName()}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user?.email}
                        </p>
                    </div>

                    {/* Chevron */}
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
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
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                {/* Navigation Items */}
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-3 py-1">
                    Account
                </DropdownMenuLabel>
                
                <DropdownMenuItem asChild>
                    <Link to="/account/settings" className="flex items-center space-x-2 px-3 py-2">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Sign Out */}
                <DropdownMenuItem 
                    onSelect={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSignOut()
                    }}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSignOut()
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavbarUserAvatar

