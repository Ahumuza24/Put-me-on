import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminBookingManagement from '~/components/admin/AdminBookingManagement'

export const meta: MetaFunction = () => {
    return [
        { title: 'Bookings - Admin Dashboard' },
        {
            name: 'description',
            content: 'Manage all bookings on the platform.',
        },
    ]
}

export default function AdminBookingsRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Bookings"
                description="Manage all platform bookings"
            >
                <AdminBookingManagement />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

