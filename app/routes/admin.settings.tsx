import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminSettings from '~/components/admin/AdminSettings'

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
                <AdminSettings />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

