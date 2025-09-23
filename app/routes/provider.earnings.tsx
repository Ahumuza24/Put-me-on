import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import ProviderEarnings from '~/components/provider/ProviderEarnings'

export const meta: MetaFunction = () => {
    return [
        { title: 'Earnings - PutMeOn' },
        {
            name: 'description',
            content: 'Track your payments, revenue, and earnings on PutMeOn.',
        },
    ]
}

export default function ProviderEarningsRoute() {
    return (
        <ProtectedRoute>
            <ProviderEarnings />
        </ProtectedRoute>
    )
}
