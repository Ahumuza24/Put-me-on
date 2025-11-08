import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminEarnings from '~/components/admin/AdminEarnings'

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
                <AdminEarnings />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

