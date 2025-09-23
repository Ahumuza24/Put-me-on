import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import ProviderAnalytics from '~/components/provider/ProviderAnalytics'

export const meta: MetaFunction = () => {
    return [
        { title: 'Analytics - PutMeOn' },
        {
            name: 'description',
            content: 'Track your performance and growth with detailed analytics on PutMeOn.',
        },
    ]
}

export default function ProviderAnalyticsRoute() {
    return (
        <ProtectedRoute>
            <ProviderAnalytics />
        </ProtectedRoute>
    )
}
