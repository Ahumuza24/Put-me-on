import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const meta: MetaFunction = () => {
    return [
        { title: 'Earnings - Admin Dashboard' },
        {
            name: 'description',
            content: 'View platform earnings and financial insights.',
        },
    ]
}

export default function AdminEarningsRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Earnings"
                description="Platform earnings and financial insights"
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Earnings & Financials</CardTitle>
                        <CardDescription>This section is under development</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Earnings and financial insights will be available here.
                        </p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

