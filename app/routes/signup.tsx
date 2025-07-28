import { type MetaFunction } from '@remix-run/node'
import SignupForm from '~/components/pages/signup/signup'

export const meta: MetaFunction = () => {
    return [
        { title: 'Sign Up - PutMeOn' },
        {
            name: 'description',
            content: 'Create your PutMeOn account to start hiring professionals or offering your services to clients.',
        },
        {
            name: 'keywords',
            content: 'signup, register, create account, join PutMeOn, service providers, freelancers',
        },
    ]
}

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 px-4 py-8">
            <SignupForm />
        </div>
    )
}