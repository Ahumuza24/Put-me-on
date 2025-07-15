import { motion } from 'framer-motion'
import { StarIcon, MapPinIcon } from 'lucide-react'
import { Button } from './ui/button'

const TopTalent = () => {
    const talents = [
        {
            name: "Lindsay Lillian",
            skill: "Full-Stack Developer",
            location: "San Francisco, CA",
            rating: 4.9,
            reviews: 127,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            portfolio: [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=300&h=200&fit=crop"
            ],
            hourlyRate: "$85"
        },
        {
            name: "Cedric Ahumuza",
            skill: "UI/UX Designer",
            location: "New York, NY",
            rating: 5.0,
            reviews: 89,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            portfolio: [
                "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop"
            ],
            hourlyRate: "$75"
        },
        {
            name: "Sydney Ayebale",
            skill: "Wedding Photographer",
            location: "Los Angeles, CA",
            rating: 4.8,
            reviews: 156,
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            portfolio: [
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=200&fit=crop"
            ],
            hourlyRate: "$120"
        },
        {
            name: "Nauma Racheal",
            skill: "Content Writer",
            location: "Austin, TX",
            rating: 4.9,
            reviews: 203,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            portfolio: [
                "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop"
            ],
            hourlyRate: "$45"
        },
        {
            name: "Kintu Moses",
            skill: "Digital Marketer",
            location: "Chicago, IL",
            rating: 4.7,
            reviews: 94,
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            portfolio: [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop"
            ],
            hourlyRate: "$65"
        },
        {
            name: "Christine Alinaitwe",
            skill: "Event Planner",
            location: "Miami, FL",
            rating: 5.0,
            reviews: 78,
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            portfolio: [
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop",
                "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop"
            ],
            hourlyRate: "$90"
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
                        Meet Our Top Talent
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover highly-rated professionals ready to bring your projects to life with exceptional quality and expertise.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {talents.map((talent, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group"
                        >
                            <div className="bg-background rounded-xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-300">
                                {/* Portfolio Preview */}
                                <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 overflow-hidden">
                                    <div className="flex gap-2 p-2">
                                        {talent.portfolio.map((image, i) => (
                                            <motion.img
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                src={image}
                                                alt={`${talent.name} work ${i + 1}`}
                                                className="w-24 h-16 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6">
                                    {/* Profile Info */}
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={talent.avatar}
                                            alt={talent.name}
                                            className="w-12 h-12 rounded-full object-cover mr-3"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {talent.name}
                                            </h3>
                                            <p className="text-primary font-medium">
                                                {talent.skill}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-muted-foreground mb-3">
                                        <MapPinIcon className="w-4 h-4 mr-1" />
                                        <span className="text-sm">{talent.location}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center mr-2">
                                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 font-medium">{talent.rating}</span>
                                        </div>
                                        <span className="text-muted-foreground text-sm">
                                            ({talent.reviews} reviews)
                                        </span>
                                    </div>

                                    {/* Rate and CTA */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-primary">
                                                {talent.hourlyRate}
                                            </span>
                                            <span className="text-muted-foreground">/hr</span>
                                        </div>
                                        <Button size="sm" className="group-hover:bg-primary/90">
                                            Hire Me
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-12"
                >
                    <Button size="lg" variant="outline">
                        View All Professionals
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

export default TopTalent