import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const meta: MetaFunction = () => {
    return [
        { title: 'Services - Admin Dashboard' },
        {
            name: 'description',
            content: 'Manage all services on the platform.',
        },
    ]
}

export default function AdminServicesRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Services"
                description="Manage all platform services"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Services Management</CardTitle>
                        <CardDescription>This section is under development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Service management features will be available here.
                        </p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

