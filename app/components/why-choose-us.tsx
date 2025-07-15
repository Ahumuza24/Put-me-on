import { motion } from 'framer-motion'
import { MapPinIcon, MessageSquareIcon, ShieldCheckIcon, CreditCardIcon, ScaleIcon } from 'lucide-react'

const WhyChooseUs = () => {
    const features = [
        {
            icon: MapPinIcon,
            title: "Localized Service Matching",
            description: "Find professionals in your area for faster, more personalized service delivery"
        },
        {
            icon: MessageSquareIcon,
            title: "Built-in Chat & Project Management",
            description: "Communicate seamlessly and track project progress all within our platform"
        },
        {
            icon: ShieldCheckIcon,
            title: "Verified Professionals",
            description: "All service providers are thoroughly vetted and verified for quality assurance"
        },
        {
            icon: CreditCardIcon,
            title: "Secure Payments",
            description: "Protected transactions with escrow services and multiple payment options"
        },
        {
            icon: ScaleIcon,
            title: "Dispute Resolution",
            description: "Fair and efficient resolution process to protect both clients and providers"
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
                        Why Choose PutMeOn?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We've built the most comprehensive platform to connect service providers with clients, ensuring quality, security, and satisfaction.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group"
                        >
                            <div className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300 h-full">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-14 h-14 mb-4 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                                >
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </motion.div>
                                
                                <h3 className="text-xl font-semibold mb-3">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                >
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
                        <div className="text-muted-foreground">Active Users</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5K+</div>
                        <div className="text-muted-foreground">Service Providers</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25K+</div>
                        <div className="text-muted-foreground">Projects Completed</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9</div>
                        <div className="text-muted-foreground">Average Rating</div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default WhyChooseUs