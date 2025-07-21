import { motion } from 'framer-motion'
import { CodeIcon, PaletteIcon, HeartIcon, PenToolIcon, CameraIcon, TrendingUpIcon } from 'lucide-react'
import FeatureCard from './feature-card'

const FeaturedCategories = () => {
    const categories = [
        {
            icon: <CodeIcon className="w-8 h-8 text-blue-600" />,
            title: "Web Development",
            description: "Custom websites, web apps, and e-commerce solutions",
            count: "150+ providers",
            backgroundColor: 'from-blue-500/20 to-blue-500/5',
        },
        {
            icon: <PaletteIcon className="w-8 h-8 text-purple-600" />,
            title: "Graphic Design",
            description: "Logos, branding, print design, and digital graphics",
            count: "200+ providers",
            backgroundColor: 'from-purple-500/20 to-purple-500/5',
        },
        {
            icon: <HeartIcon className="w-8 h-8 text-pink-600" />,
            title: "Events & Weddings",
            description: "Wedding planning, event coordination, and party services",
            count: "80+ providers",
            backgroundColor: 'from-pink-500/20 to-pink-500/5',
        },
        {
            icon: <PenToolIcon className="w-8 h-8 text-green-600" />,
            title: "Content Writing",
            description: "Blog posts, copywriting, technical writing, and editing",
            count: "120+ providers",
            backgroundColor: 'from-green-500/20 to-green-500/5',
        },
        {
            icon: <CameraIcon className="w-8 h-8 text-orange-600" />,
            title: "Photography & Video",
            description: "Event photography, product shoots, and video production",
            count: "90+ providers",
            backgroundColor: 'from-orange-500/20 to-orange-500/5',
        },
        {
            icon: <TrendingUpIcon className="w-8 h-8 text-red-600" />,
            title: "Marketing",
            description: "Digital marketing, SEO, social media, and advertising",
            count: "110+ providers",
            backgroundColor: 'from-red-500/20 to-red-500/5',
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
                        Featured Categories
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our most popular service categories and find the perfect professional for your needs.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            className="group cursor-pointer"
                        >
                            <div className="relative">
                                <FeatureCard
                                    title={category.title}
                                    description={category.description}
                                    icon={category.icon}
                                    backgroundColor={category.backgroundColor}
                                />
                                
                                {/* Provider count overlay */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                    <span className="text-sm text-primary font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                                        {category.count}
                                    </span>
                                    <motion.span
                                        initial={{ x: -10, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                        className="text-sm text-primary font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded"
                                    >
                                        Explore →
                                    </motion.span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories