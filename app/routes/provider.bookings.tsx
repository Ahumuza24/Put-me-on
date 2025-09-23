import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import BookingManagement from '~/components/provider/BookingManagement'

export const meta: MetaFunction = () => {
    return [
        { title: 'My Bookings - PutMeOn' },
        {
            name: 'description',
            content: 'Manage your bookings and client requests on PutMeOn.',
        },
    ]
}

export default function ProviderBookingsRoute() {
    return (
        <ProtectedRoute>
            <BookingManagement />
        </ProtectedRoute>
    )
}
