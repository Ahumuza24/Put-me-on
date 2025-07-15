import { motion } from 'framer-motion'
import { ShieldCheckIcon, CreditCardIcon, HeadphonesIcon, StarIcon } from 'lucide-react'

const TrustSafety = () => {
    const features = [
        {
            icon: CreditCardIcon,
            title: "Secure Payments",
            description: "All transactions are protected with bank-level security and escrow services"
        },
        {
            icon: ShieldCheckIcon,
            title: "Verified Providers",
            description: "Every service provider goes through our comprehensive verification process"
        },
        {
            icon: HeadphonesIcon,
            title: "24/7 Support",
            description: "Our dedicated support team is available around the clock to help you"
        },
        {
            icon: StarIcon,
            title: "Transparent Reviews",
            description: "Honest reviews and ratings from real clients help you make informed decisions"
        }
    ]

    return (
        <section className="py-20 px-5 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Trust & Safety First
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your security and satisfaction are our top priorities. We've built comprehensive safeguards to protect every interaction.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="text-center"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"
                            >
                                <feature.icon className="w-8 h-8 text-primary" />
                            </motion.div>
                            
                            <h3 className="text-xl font-semibold mb-3">
                                {feature.title}
                            </h3>
                            
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustSafety