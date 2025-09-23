import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import ProviderMessages from '~/components/provider/ProviderMessages'

export const meta: MetaFunction = () => {
    return [
        { title: 'Messages - PutMeOn' },
        {
            name: 'description',
            content: 'Communicate with your clients and manage conversations on PutMeOn.',
        },
    ]
}

export default function ProviderMessagesRoute() {
    return (
        <ProtectedRoute>
            <ProviderMessages />
        </ProtectedRoute>
    )
}
