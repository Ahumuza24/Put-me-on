import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

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
                <Card>
                    <CardHeader>
                        <CardTitle>Bookings Management</CardTitle>
                        <CardDescription>This section is under development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Booking management features will be available here.
                        </p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

