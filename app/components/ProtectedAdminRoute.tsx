import { useAuth } from '~/context/AuthContext';
import { Navigate } from '@remix-run/react';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-2 border-primary"></div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is admin or super_admin
    if (profile?.userType !== 'admin' && profile?.userType !== 'super_admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

