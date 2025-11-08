import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminDashboard from '~/components/admin/AdminDashboard'

export const meta: MetaFunction = () => {
    return [
        { title: 'Admin Dashboard - PutMeOn' },
        {
            name: 'description',
            content: 'Super admin control center for managing the PutMeOn platform.',
        },
    ]
}

export default function AdminDashboardRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Admin Dashboard"
                description="Platform overview and insights"
            >
                <AdminDashboard />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

