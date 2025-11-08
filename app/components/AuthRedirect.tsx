import { useEffect } from 'react'
import { useNavigate } from '@remix-run/react'
import { useAuth } from '~/context/AuthContext'

interface AuthRedirectProps {
    children: React.ReactNode
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
    const { user, profile, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // Only redirect if user is authenticated and not loading
        if (!loading && user) {
            // Small delay to ensure profile is loaded
            const timer = setTimeout(() => {
                if (profile) {
                    // Redirect based on user type
                    if (profile.userType === 'admin' || profile.userType === 'super_admin') {
                        navigate('/admin/dashboard', { replace: true })
                    } else if (profile.userType === 'provider') {
                        navigate('/provider/dashboard', { replace: true })
                    } else {
                        navigate('/dashboard', { replace: true })
                    }
                } else {
                    // If no profile, redirect to general dashboard
                    navigate('/dashboard', { replace: true })
                }
            }, 1000) // 1 second delay to allow profile to load

            return () => clearTimeout(timer)
        }
    }, [user, profile, loading, navigate])

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
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                </div>
            </div>
        )
    }

    // If not authenticated, show the landing page
    return <>{children}</>
}

export default AuthRedirect
