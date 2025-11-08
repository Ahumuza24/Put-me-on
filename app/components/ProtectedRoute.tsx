import { useAuth } from '~/context/AuthContext';
import { Navigate, useLocation } from '@remix-run/react';
import { PageSkeleton } from '~/components/ui/skeletons';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <PageSkeleton />;
    }

    if (!user) {
        // Preserve the current location so we can redirect back after login
        const redirectTo = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
    }

    return <>{children}</>;
}