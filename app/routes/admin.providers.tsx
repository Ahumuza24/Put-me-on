import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const meta: MetaFunction = () => {
    return [
        { title: 'Providers - Admin Dashboard' },
        {
            name: 'description',
            content: 'Manage service providers on the platform.',
        },
    ]
}

export default function AdminProvidersRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Providers"
                description="Manage all service providers"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Providers Management</CardTitle>
                        <CardDescription>This section is under development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Provider management features will be available here.
                        </p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

