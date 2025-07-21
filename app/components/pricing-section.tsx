import { CheckIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { useState } from 'react'
import { cn } from '~/lib/utils'

const PricingSection = () => {
    const [isAnnual, setIsAnnual] = useState(false)

    const plans = [
        {
            name: "Basic",
            monthlyPrice: 0,
            annualPrice: 0,
            description: "Perfect for getting started",
            features: [
                "Create basic profile",
                "Browse services", 
                "Send up to 5 messages/month",
                "Basic search filters",
                "Community support",
                "Email support"
            ],
            cta: "Get Started",
            popular: false,
            gradient: "from-primary/10 via-transparent to-transparent",
            borderGradient: "before:from-primary/30 before:to-primary/5"
        },
        {
            name: "Professional", 
            monthlyPrice: 19,
            annualPrice: 193, // 15% discount
            description: "For active service providers",
            features: [
                "Everything in Basic",
                "Unlimited messaging",
                "Featured profile listings", 
                "Advanced portfolio showcase",
                "Priority search ranking",
                "Analytics dashboard",
                "Custom profile URL",
                "Priority email support"
            ],
            cta: "Start Free Trial",
            popular: true,
            gradient: "from-primary/10 via-transparent to-transparent",
            borderGradient: "before:from-primary before:to-primary/10"
        },
        {
            name: "Enterprise",
            monthlyPrice: 49,
            annualPrice: 499, // 15% discount  
            description: "For agencies and teams",
            features: [
                "Everything in Professional",
                "Team collaboration tools",
                "White-label options",
                "API access", 
                "Dedicated account manager",
                "Custom integrations",
                "24/7 priority support",
                "Advanced reporting"
            ],
            cta: "Contact Sales",
            popular: false,
            gradient: "from-primary/10 via-transparent to-transparent", 
            borderGradient: "before:from-primary/30 before:to-primary/5"
        }
    ]

    return (
        <section className='mx-auto mb-8 mt-0 px-5 dark:bg-[radial-gradient(ellipse_40%_50%_at_50%_-20%,hsla(var(--primary)_/_30%),#ffffff00)]'>
            <div className='mx-auto mb-16 h-[1px] w-full max-w-2xl bg-gradient-to-r from-transparent via-primary to-transparent'></div>
            <div className='mx-auto flex max-w-7xl flex-col gap-6 text-center'>
                <div>
                    <span className='rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/25'>
                        <span className='brightness-[1.7]'>
                            Simple Pricing
                        </span>
                    </span>
                    <h1 className='mt-4 scroll-m-20 font-inter text-4xl font-extrabold tracking-tight lg:text-5xl'>
                        <span className='bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent'>
                            Choose{' '}
                        </span>
                        <span className='bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent'>
                            your{' '}
                        </span>
                        <span className='bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent'>
                            plan
                        </span>
                    </h1>
                </div>
                <p className='text-lg text-muted-foreground'>
                    Start free and upgrade as you grow your business
                </p>
                <div className='mt-20 flex items-center justify-center space-x-2'>
                    <Label
                        htmlFor='price-toggle'
                        className={cn(isAnnual && 'text-muted-foreground')}
                    >
                        Monthly
                    </Label>
                    <Switch
                        id='price-toggle'
                        defaultChecked={false}
                        checked={isAnnual}
                        onCheckedChange={() => setIsAnnual(!isAnnual)}
                        className='data-[state=unchecked]:bg-primary'
                        aria-label='toggle pricing'
                    />
                    <Label
                        htmlFor='price-toggle'
                        className={cn(!isAnnual && 'text-muted-foreground')}
                    >
                        Annually
                    </Label>
                </div>
                <div className='mt-10 flex flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-around lg:px-6'>
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={cn(
                                'gradient-border relative w-full max-w-sm flex-grow basis-0 rounded-md bg-gradient-to-bl p-8 text-left lg:max-w-none',
                                plan.gradient,
                                plan.borderGradient,
                                index === 0 && 'before:bg-gradient-to-bl',
                                index === 1 && 'before:bg-gradient-to-b', 
                                index === 2 && 'before:bg-gradient-to-br'
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            
                            <div className='flex flex-col gap-3 text-left'>
                                <p className="text-lg font-medium">{plan.name}</p>
                                <div className='flex items-start gap-2'>
                                    <span className='text-2xl text-muted-foreground'>
                                        $
                                    </span>
                                    <span className='flex items-center gap-2 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-5xl font-medium text-transparent'>
                                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                        {isAnnual && plan.monthlyPrice > 0 && (
                                            <Badge variant={'outline'}>
                                                SAVE 15%
                                            </Badge>
                                        )}
                                    </span>
                                </div>
                                <p className='text-muted-foreground'>
                                    {plan.description}
                                </p>
                            </div>
                            <ul className='mt-8 flex flex-col gap-4'>
                                {plan.features.map((feature, i) => (
                                    <li key={i} className='flex gap-2'>
                                        <CheckIcon className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                className='mt-8 w-full' 
                                variant={plan.popular ? 'default' : 'outline'}
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PricingSection