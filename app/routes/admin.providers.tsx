import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminProviderManagement from '~/components/admin/AdminProviderManagement'

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
                <AdminProviderManagement />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

