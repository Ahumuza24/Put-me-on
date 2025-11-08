import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const meta: MetaFunction = () => {
    return [
        { title: 'Settings - Admin Dashboard' },
        {
            name: 'description',
            content: 'Platform settings and configuration.',
        },
    ]
}

export default function AdminSettingsRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Settings"
                description="Platform settings and configuration"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Platform Settings</CardTitle>
                        <CardDescription>This section is under development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Platform settings and configuration will be available here.
                        </p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

