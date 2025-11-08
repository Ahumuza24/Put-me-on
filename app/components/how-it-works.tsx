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
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-5">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10 sm:mb-12 md:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                        How It Works
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                        Getting started is simple. Follow these three easy steps to connect with professionals or start earning from your skills.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative px-4"
                        >
                            <div className="text-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-primary/10 rounded-full flex items-center justify-center"
                                >
                                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                                </motion.div>
                                
                                <div className="absolute top-0 right-0 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                                    {index + 1}
                                </div>
                                
                                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                                    {step.title}
                                </h3>
                                
                                <p className="text-sm sm:text-base text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                            
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks