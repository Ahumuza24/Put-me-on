import { type MetaFunction } from '@remix-run/node'
import { ProtectedRoute } from '~/components/ProtectedRoute'
import Navbar from '~/components/navbar'
import Footer from '~/components/footer'
import AccountSettings from '~/components/account/AccountSettings'

export const meta: MetaFunction = () => {
    return [
        { title: 'Account Settings - PutMeOn' },
        {
            name: 'description',
            content: 'Manage your account settings, update your profile information, and change your password.',
        },
    ]
}

export default function AccountSettingsRoute() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <AccountSettings />
                <Footer />
            </div>
        </ProtectedRoute>
    )
}

