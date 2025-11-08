import { useAuth } from '~/context/AuthContext';
import { Navigate } from '@remix-run/react';
import { PageSkeleton } from '~/components/ui/skeletons';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <PageSkeleton />;
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

