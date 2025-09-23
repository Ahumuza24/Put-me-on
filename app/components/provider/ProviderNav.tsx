import React from 'react'
import { Link, useLocation } from '@remix-run/react'
import { motion } from 'framer-motion'
import { 
    LayoutDashboard, 
    User, 
    Briefcase, 
    Calendar, 
    MessageSquare, 
    Settings,
    BarChart3,
    DollarSign
} from 'lucide-react'
import { cn } from '~/lib/utils'

const ProviderNav: React.FC = () => {
    const location = useLocation()

    const navItems = [
        {
            name: 'Dashboard',
            href: '/provider/dashboard',
            icon: LayoutDashboard,
            description: 'Overview and stats'
        },
        {
            name: 'Profile',
            href: '/provider/profile',
            icon: User,
            description: 'Manage your profile'
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
        {
            name: 'Settings',
            href: '/provider/settings',
            icon: Settings,
            description: 'Account settings'
        }
    ]

    return (
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 overflow-x-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    isActive
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}

export default ProviderNav
