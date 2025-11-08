import { type MetaFunction } from '@remix-run/node'
import Navbar from '~/components/navbar'
import Footer from '~/components/footer'
import ServicesBrowse from '~/components/customer/ServicesBrowse'
import { ProtectedRoute } from '~/components/ProtectedRoute'

export const meta: MetaFunction = () => {
    return [
        { title: 'Browse Services - PutMeOn' },
        {
            name: 'description',
            content: 'Browse and find the perfect service provider for your needs. Search by category, location, and more.',
        },
    ]
}

export default function ServicesRoute() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <ServicesBrowse />
                <Footer />
            </div>
        </ProtectedRoute>
    )
}

