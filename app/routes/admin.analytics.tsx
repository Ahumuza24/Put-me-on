import { type MetaFunction } from '@remix-run/node'
import { ProtectedAdminRoute } from '~/components/ProtectedAdminRoute'
import AdminLayout from '~/components/admin/AdminLayout'
import AdminAnalytics from '~/components/admin/AdminAnalytics'

export const meta: MetaFunction = () => {
    return [
        { title: 'Analytics - Admin Dashboard' },
        {
            name: 'description',
            content: 'Platform analytics and insights.',
        },
    ]
}

export default function AdminAnalyticsRoute() {
    return (
        <ProtectedAdminRoute>
            <AdminLayout
                title="Analytics"
                description="Platform analytics and insights"
            >
                <AdminAnalytics />
            </AdminLayout>
        </ProtectedAdminRoute>
    )
}

