import { motion } from 'framer-motion'
import { MessageCircleIcon, CalendarIcon, CreditCardIcon, CheckCircleIcon } from 'lucide-react'

const DemoSection = () => {
    const steps = [
        {
            icon: MessageCircleIcon,
            title: "Chat & Connect",
            description: "Start a conversation with your chosen professional",
            mockup: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop"
        },
        {
            icon: CalendarIcon,
            title: "Schedule & Plan",
            description: "Set timelines and project milestones together",
            mockup: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop"
        },
        {
            icon: CreditCardIcon,
            title: "Secure Payment",
            description: "Pay safely with our escrow protection system",
            mockup: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop"
        },
        {
            icon: CheckCircleIcon,
            title: "Project Complete",
            description: "Review work and release payment when satisfied",
            mockup: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
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
                        See How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From first contact to project completion, our platform makes the entire process smooth and secure.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            {/* Mock Screen */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative mb-6 mx-auto w-48 h-32 bg-background rounded-lg shadow-lg border overflow-hidden"
                            >
                                <img
                                    src={step.mockup}
                                    alt={step.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <step.icon className="w-6 h-6 text-primary mx-auto" />
                                </div>
                            </motion.div>

                            <div className="relative">
                                <div className="absolute -top-8 -left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                
                                <h3 className="text-xl font-semibold mb-3">
                                    {step.title}
                                </h3>
                                
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Interactive Demo CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                   
                </motion.div>
            </div>
        </section>
    )
}

export default DemoSection