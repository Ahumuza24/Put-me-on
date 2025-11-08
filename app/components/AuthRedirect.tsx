import { useEffect } from 'react'
import { useAuth } from '~/context/AuthContext'

interface AuthRedirectProps {
    children: React.ReactNode
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
    const { user, profile, loading } = useAuth()

    useEffect(() => {
        // Only redirect if user is authenticated and not loading
        if (!loading && user) {
            // Small delay to ensure profile is loaded and React finishes rendering
            const timer = setTimeout(() => {
                let redirectPath = '/services' // Default for clients
                
                if (profile) {
                    // Redirect based on user type
                    if (profile.userType === 'admin' || profile.userType === 'super_admin') {
                        redirectPath = '/admin/dashboard'
                    } else if (profile.userType === 'provider') {
                        redirectPath = '/provider/dashboard'
                    }
                }
                
                // Use window.location for hard redirect to avoid DOM conflicts
                // This prevents React from trying to update the DOM during navigation
                window.location.href = redirectPath
            }, 500) // Reduced delay but still allows profile to load

            return () => clearTimeout(timer)
        }
    }, [user, profile, loading])

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // If user is authenticated, show loading while redirecting
    if (user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        )
    }

    // If not authenticated, show the landing page
    return <>{children}</>
}

export default AuthRedirect
