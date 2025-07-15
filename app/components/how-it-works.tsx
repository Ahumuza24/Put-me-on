import { motion } from 'framer-motion'
import { UserPlusIcon, SearchIcon, MessageCircleIcon } from 'lucide-react'

const HowItWorks = () => {
    const steps = [
        {
            icon: UserPlusIcon,
            title: "Sign Up & Create Profile",
            description: "Create your account and build a compelling profile showcasing your skills or service needs"
        },
        {
            icon: SearchIcon,
            title: "Search or Offer Services",
            description: "Browse available services or post your own offerings to connect with the right people"
        },
        {
            icon: MessageCircleIcon,
            title: "Connect, Chat & Hire",
            description: "Communicate directly, negotiate terms, and complete secure transactions all in one place"
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
                        How It Works
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Getting started is simple. Follow these three easy steps to connect with professionals or start earning from your skills.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative"
                        >
                            <div className="text-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
                                >
                                    <step.icon className="w-10 h-10 text-primary" />
                                </motion.div>
                                
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                
                                <h3 className="text-xl font-semibold mb-4">
                                    {step.title}
                                </h3>
                                
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                            
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks