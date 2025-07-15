import { motion } from 'framer-motion'
import { CodeIcon, PaletteIcon, HeartIcon, PenToolIcon, CameraIcon, TrendingUpIcon } from 'lucide-react'

const FeaturedCategories = () => {
    const categories = [
        {
            icon: CodeIcon,
            title: "Web Development",
            description: "Custom websites, web apps, and e-commerce solutions",
            count: "150+ providers"
        },
        {
            icon: PaletteIcon,
            title: "Graphic Design",
            description: "Logos, branding, print design, and digital graphics",
            count: "200+ providers"
        },
        {
            icon: HeartIcon,
            title: "Events & Weddings",
            description: "Wedding planning, event coordination, and party services",
            count: "80+ providers"
        },
        {
            icon: PenToolIcon,
            title: "Content Writing",
            description: "Blog posts, copywriting, technical writing, and editing",
            count: "120+ providers"
        },
        {
            icon: CameraIcon,
            title: "Photography & Video",
            description: "Event photography, product shoots, and video production",
            count: "90+ providers"
        },
        {
            icon: TrendingUpIcon,
            title: "Marketing",
            description: "Digital marketing, SEO, social media, and advertising",
            count: "110+ providers"
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
                            <div className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-lg transition-all duration-300">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="w-16 h-16 mb-4 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                                >
                                    <category.icon className="w-8 h-8 text-primary" />
                                </motion.div>
                                
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {category.title}
                                </h3>
                                
                                <p className="text-muted-foreground mb-4">
                                    {category.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-primary font-medium">
                                        {category.count}
                                    </span>
                                    <motion.span
                                        initial={{ x: -10, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                        className="text-sm text-primary font-medium"
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