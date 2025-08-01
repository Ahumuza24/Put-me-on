import { type MetaFunction } from '@remix-run/node'
import LoginForm from '~/components/pages/login/login'

export const meta: MetaFunction = () => {
    return [
        { title: 'Login - PutMeOn' },
        {
            name: 'description',
            content: 'Login to your PutMeOn account to access your dashboard and connect with service providers.',
        },
    ]
}


export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 px-4">
            <LoginForm />
        </div>
    )
}