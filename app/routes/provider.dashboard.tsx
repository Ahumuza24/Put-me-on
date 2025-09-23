import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import ProviderDashboard from '~/components/provider/ProviderDashboard'

export const meta: MetaFunction = () => {
    return [
        { title: 'Provider Dashboard - PutMeOn' },
        {
            name: 'description',
            content: 'Manage your service provider profile, listings, and bookings on PutMeOn.',
        },
    ]
}

export default function ProviderDashboardRoute() {
    return (
        <ProtectedRoute>
            <ProviderDashboard />
        </ProtectedRoute>
    )
}
