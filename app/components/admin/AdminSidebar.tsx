import React from 'react'
import { Link, useLocation } from '@remix-run/react'
import { 
    LayoutDashboard, 
    Users, 
    Briefcase, 
    DollarSign,
    BarChart3,
    Bell,
    Settings,
    Shield,
    FileText,
    AlertCircle,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    MessageSquare
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import AdminUserAvatar from './AdminUserAvatar'

interface AdminSidebarProps {
    isOpen: boolean
    onToggle: () => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
    isOpen, 
    onToggle, 
    isCollapsed, 
    onToggleCollapse 
}) => {
    const location = useLocation()

    const navItems = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            description: 'Overview and insights'
        },
        {
            name: 'Users',
            href: '/admin/users',
            icon: Users,
            description: 'Manage all users'
        },
        {
            name: 'Providers',
            href: '/admin/providers',
            icon: Briefcase,
            description: 'Service providers'
        },
        {
            name: 'Services',
            href: '/admin/services',
            icon: FileText,
            description: 'All services'
        },
        {
            name: 'Bookings',
            href: '/admin/bookings',
            icon: BarChart3,
            description: 'Manage bookings'
        },
        {
            name: 'Earnings',
            href: '/admin/earnings',
            icon: DollarSign,
            description: 'Platform earnings'
        },
        {
            name: 'Notifications',
            href: '/admin/notifications',
            icon: Bell,
            description: 'New sign-ups & alerts'
        },
        {
            name: 'Messages',
            href: '/admin/messages',
            icon: MessageSquare,
            description: 'User messages'
        },
        {
            name: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
            description: 'Platform analytics'
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            description: 'Platform settings'
        },
        {
            name: 'Reports',
            href: '/admin/reports',
            icon: FileText,
            description: 'Export reports'
        },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-full bg-background border-r shadow-lg transition-all duration-300",
                    "lg:translate-x-0 lg:block",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    isCollapsed ? "lg:w-20" : "lg:w-72"
                )}
                style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                }}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-primary" />
                            {!isCollapsed && (
                                <div>
                                    <span className="font-semibold text-lg block">
                                        Admin Panel
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        PutMeOn
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleCollapse}
                                className="hidden lg:flex"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                            </Button>
                            
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggle}
                                className="lg:hidden"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => {
                                        // Close mobile sidebar when navigating
                                        if (window.innerWidth < 1024) {
                                            onToggle()
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <Icon className={cn(
                                        "h-5 w-5 flex-shrink-0",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                    
                                    {!isCollapsed && (
                                        <div className="flex-1 min-w-0">
                                            <span className="truncate">{item.name}</span>
                                            <p className="text-xs text-muted-foreground group-hover:text-foreground/70 truncate">
                                                {item.description}
                                            </p>
                                        </div>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Avatar at Bottom */}
                    {!isCollapsed && (
                        <div className="p-4 border-t">
                            <AdminUserAvatar />
                        </div>
                    )}
                    
                    {/* Collapsed Avatar */}
                    {isCollapsed && (
                        <div className="p-4 border-t">
                            <AdminUserAvatar className="justify-center px-2" />
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default AdminSidebar

