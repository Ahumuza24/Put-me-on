import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminReports from '~/components/admin/AdminReports'

export const meta: MetaFunction = () => {
    return [
        { title: 'Reports - Admin Dashboard' },
        {
            name: 'description',
            content: 'Generate and export platform reports.',
        },
    ]
}

export default function AdminReportsRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Reports"
                description="Generate and export platform reports"
            >
                <AdminReports />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

