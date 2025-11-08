import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import NotificationsCenter from '~/components/admin/NotificationsCenter'

export const meta: MetaFunction = () => {
    return [
        { title: 'Notifications - Admin Dashboard' },
        {
            name: 'description',
            content: 'View and manage platform notifications and new sign-ups.',
        },
    ]
}

export default function AdminNotificationsRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Notifications"
                description="New sign-ups and platform alerts"
            >
                <NotificationsCenter />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

