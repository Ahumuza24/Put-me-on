import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import ProviderProfile from '~/components/provider/ProviderProfile'

export const meta: MetaFunction = () => {
    return [
        { title: 'Provider Profile - PutMeOn' },
        {
            name: 'description',
            content: 'Create and manage your service provider profile on PutMeOn.',
        },
    ]
}

export default function ProviderProfileRoute() {
    return (
        <ProtectedRoute>
            <ProviderProfile />
        </ProtectedRoute>
    )
}
