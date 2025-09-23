import React, { useState } from 'react'
import { Link, useLocation } from '@remix-run/react'
import { 
    LayoutDashboard, 
    Briefcase, 
    Calendar, 
    MessageSquare, 
    Settings,
    BarChart3,
    DollarSign,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface ProviderSidebarProps {
    isOpen: boolean
    onToggle: () => void
    isCollapsed: boolean
    onToggleCollapse: () => void
}

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ 
    isOpen, 
    onToggle, 
    isCollapsed, 
    onToggleCollapse 
}) => {
    const location = useLocation()

    const navItems = [
        {
            name: 'Dashboard',
            href: '/provider/dashboard',
            icon: LayoutDashboard,
            description: 'Overview and stats'
        },
        
        {
            name: 'Services',
            href: '/provider/services',
            icon: Briefcase,
            description: 'Manage your services'
        },
        {
            name: 'Bookings',
            href: '/provider/bookings',
            icon: Calendar,
            description: 'Client requests'
        },
        {
            name: 'Messages',
            href: '/provider/messages',
            icon: MessageSquare,
            description: 'Client conversations'
        },
        {
            name: 'Analytics',
            href: '/provider/analytics',
            icon: BarChart3,
            description: 'Performance insights'
        },
        {
            name: 'Earnings',
            href: '/provider/earnings',
            icon: DollarSign,
            description: 'Payment history'
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
                            <img 
                                src="/Pmo.png" 
                                alt="PutMeOn logo" 
                                className="w-8 h-8 object-contain"
                            />
                            {!isCollapsed && (
                                <span className="font-semibold text-lg">
                                    PutMeOn
                                </span>
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
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item, index) => {
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

                </div>
            </aside>
        </>
    )
}

export default ProviderSidebar
