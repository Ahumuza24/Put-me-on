import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import ProviderSidebar from './ProviderSidebar'

interface ProviderLayoutProps {
    children: React.ReactNode
    title: string
    description?: string
    actions?: React.ReactNode
}

const ProviderLayout: React.FC<ProviderLayoutProps> = ({ 
    children, 
    title, 
    description, 
    actions 
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // On desktop, sidebar should be open by default
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true)
            }
        }
        
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed(!sidebarCollapsed)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <ProviderSidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebarCollapse}
            />

            {/* Main Content */}
            <div className={cn(
                "transition-all duration-300",
                sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
            )}>
                {/* Top Header */}
                <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3 sm:px-4 py-3 sm:py-4 lg:px-6">
                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleSidebar}
                                className="lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            
                            <div className="min-w-0 flex-1 sm:flex-none">
                                <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
                                {description && (
                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{description}</p>
                                )}
                            </div>
                        </div>
                        
                        {actions && (
                            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <main className="p-3 sm:p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default ProviderLayout
