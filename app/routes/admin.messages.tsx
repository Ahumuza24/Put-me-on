import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const meta: MetaFunction = () => {
    return [
        { title: 'Messages - Admin Dashboard' },
        {
            name: 'description',
            content: 'Monitor user messages on the platform.',
        },
    ]
}

export default function AdminMessagesRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Messages"
                description="Monitor user messages"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Messages Management</CardTitle>
                        <CardDescription>This section is under development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Message monitoring features will be available here.
                        </p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

