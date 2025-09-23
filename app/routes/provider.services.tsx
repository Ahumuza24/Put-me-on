import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import ServiceManagement from '~/components/provider/ServiceManagement'

export const meta: MetaFunction = () => {
    return [
        { title: 'My Services - PutMeOn' },
        {
            name: 'description',
            content: 'Manage your service listings and offerings on PutMeOn.',
        },
    ]
}

export default function ProviderServicesRoute() {
    return (
        <ProtectedRoute>
            <ServiceManagement />
        </ProtectedRoute>
    )
}
