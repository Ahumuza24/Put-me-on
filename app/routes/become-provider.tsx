import { type MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { 
    CheckCircle, 
    DollarSign, 
    Users, 
    Clock, 
    Shield, 
    Star,
    ArrowRight,
    Briefcase,
    Calendar,
    MessageSquare
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

export const meta: MetaFunction = () => {
    return [
        { title: 'Become a Provider - PutMeOn' },
        {
            name: 'description',
            content: 'Join PutMeOn as a service provider and start earning from your skills. Create your profile, list services, and connect with clients.',
        },
    ]
}

const BecomeProvider = () => {
    const benefits = [
        {
            icon: DollarSign,
            title: 'Earn More',
            description: 'Set your own rates and earn what you deserve for your expertise'
        },
        {
            icon: Users,
            title: 'Connect with Clients',
            description: 'Access a network of clients looking for your specific skills'
        },
        {
            icon: Clock,
            title: 'Flexible Schedule',
            description: 'Work on your own time and choose projects that fit your schedule'
        },
        {
            icon: Shield,
            title: 'Secure Payments',
            description: 'Get paid safely through our secure escrow system'
        },
        {
            icon: Star,
            title: 'Build Reputation',
            description: 'Earn reviews and build a strong professional reputation'
        },
        {
            icon: Briefcase,
            title: 'Professional Tools',
            description: 'Access tools to manage projects, communicate, and track progress'
        }
    ]

    const steps = [
        {
            number: 1,
            title: 'Create Your Profile',
            description: 'Set up your professional profile with bio, skills, and portfolio',
            icon: Users
        },
        {
            number: 2,
            title: 'List Your Services',
            description: 'Create detailed service listings with pricing and descriptions',
            icon: Briefcase
        },
        {
            number: 3,
            title: 'Get Booked',
            description: 'Clients find and book your services based on their needs',
            icon: Calendar
        },
        {
            number: 4,
            title: 'Deliver & Earn',
            description: 'Complete projects, communicate with clients, and get paid',
            icon: MessageSquare
        }
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="py-20 px-5 bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Start Earning as a{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Service Provider
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                            Join thousands of professionals who are already earning from their skills. 
                            Create your profile, list your services, and start connecting with clients today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link to="/signup">
                                    Get Started Free
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/provider/dashboard">
                                    View Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-5">
                <div className="max-w-7xl mx-auto">
                    <div
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Choose PutMeOn?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We provide everything you need to succeed as a service provider
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                            <benefit.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {benefit.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-5 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get started in just a few simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="text-center"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                        <step.icon className="h-8 w-8 text-primary-foreground" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary">{step.number}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-5">
                <div className="max-w-7xl mx-auto">
                    <div
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Join Our Growing Community
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Thousands of providers are already earning on PutMeOn
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5K+</div>
                            <div className="text-muted-foreground">Active Providers</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">25K+</div>
                            <div className="text-muted-foreground">Projects Completed</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$2M+</div>
                            <div className="text-muted-foreground">Earned by Providers</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9</div>
                            <div className="text-muted-foreground">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-5 bg-primary/5">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Start Earning?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join PutMeOn today and start your journey as a service provider. 
                            It's free to get started!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link to="/signup">
                                    Create Your Profile
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link to="/contact">
                                    Contact Sales
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BecomeProvider
