import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import UserManagement from '~/components/admin/UserManagement'

export const meta: MetaFunction = () => {
    return [
        { title: 'User Management - Admin Dashboard' },
        {
            name: 'description',
            content: 'Manage all users on the PutMeOn platform.',
        },
    ]
}

export default function AdminUsersRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="User Management"
                description="Manage users, verify accounts, and monitor activity"
            >
                <UserManagement />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

