import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminServiceManagement from '~/components/admin/AdminServiceManagement'

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
                <AdminServiceManagement />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

