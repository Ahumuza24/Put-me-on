import { motion } from 'framer-motion'
import { CheckIcon, XIcon } from 'lucide-react'
import { Button } from './ui/button'

const PricingSection = () => {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Perfect for getting started",
            features: [
                "Create basic profile",
                "Browse services",
                "Send up to 5 messages/month",
                "Basic search filters",
                "Community support"
            ],
            limitations: [
                "No featured listings",
                "Limited portfolio uploads",
                "No priority support"
            ],
            cta: "Get Started",
            popular: false
        },
        {
            name: "Professional",
            price: "UGX 69,350",
            period: "/month",
            description: "For active service providers",
            features: [
                "Everything in Basic",
                "Unlimited messaging",
                "Featured profile listings",
                "Advanced portfolio showcase",
                "Priority search ranking",
                "Analytics dashboard",
                "Email support",
                "Custom profile URL"
            ],
            limitations: [
                "5% transaction fee"
            ],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Enterprise",
            price: "UGX 178,850",
            period: "/month",
            description: "For agencies and teams",
            features: [
                "Everything in Professional",
                "Team collaboration tools",
                "White-label options",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
                "Priority support",
                "Advanced reporting"
            ],
            limitations: [],
            cta: "Contact Sales",
            popular: false
        }
    ]

    return (
        <section className="py-20 px-5">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the plan that fits your needs. Start free and upgrade as you grow.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative bg-background rounded-2xl p-8 border shadow-sm hover:shadow-lg transition-all duration-300 ${
                                plan.popular ? 'border-primary shadow-primary/10' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    )}
                                </div>
                                <p className="text-muted-foreground">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                                
                                {plan.limitations.map((limitation, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <XIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground">{limitation}</span>
                                    </div>
                                ))}
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                                    variant={plan.popular ? 'default' : 'outline'}
                                    size="lg"
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                        <div>
                            <h4 className="font-medium mb-2">Can I change plans anytime?</h4>
                            <p className="text-muted-foreground text-sm">
                                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Is there a free trial?</h4>
                            <p className="text-muted-foreground text-sm">
                                Professional plan comes with a 14-day free trial. No credit card required.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                            <p className="text-muted-foreground text-sm">
                                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
                            <p className="text-muted-foreground text-sm">
                                Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default PricingSection