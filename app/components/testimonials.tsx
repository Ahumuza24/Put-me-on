import { motion } from 'framer-motion'
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

const Testimonials = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    
    const testimonials = [
        {
            name: "Lindsay Lillian",
            role: "Small Business Owner",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            quote: "Found an amazing web developer through PutMeOn. The project was completed on time and exceeded my expectations. The built-in chat made communication seamless!"
        },
        {
            name: "Cedric Ahumuza",
            role: "Freelance Designer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            quote: "As a provider, PutMeOn has been incredible for my business. I've connected with so many local clients and the secure payment system gives everyone peace of mind."
        },
        {
            name: "Nauma Racheal",
            role: "Event Coordinator",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            quote: "Planning my wedding was stress-free thanks to PutMeOn. I found all my vendors in one place and could manage everything through their platform. Highly recommend!"
        },
        {
            name: "Sydney Ayebale",
            role: "Marketing Manager",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            rating: 5,
            quote: "The quality of professionals on PutMeOn is outstanding. I've hired content writers, designers, and photographers - all delivered exceptional work."
        }
    ]

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <section className="py-20 px-5">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Don't just take our word for it - hear from our satisfied clients and service providers.
                    </p>
                </motion.div>

                <div className="relative">
                    <motion.div
                        key={currentTestimonial}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="bg-background rounded-2xl p-8 shadow-lg border"
                    >
                        <div className="flex items-center mb-6">
                            <img
                                src={testimonials[currentTestimonial].avatar}
                                alt={testimonials[currentTestimonial].name}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h4 className="font-semibold text-lg">
                                    {testimonials[currentTestimonial].name}
                                </h4>
                                <p className="text-muted-foreground">
                                    {testimonials[currentTestimonial].role}
                                </p>
                            </div>
                        </div>

                        <div className="flex mb-4">
                            {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                        </div>

                        <blockquote className="text-lg leading-relaxed">
                            "{testimonials[currentTestimonial].quote}"
                        </blockquote>
                    </motion.div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevTestimonial}
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${
                                        index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                                    }`}
                                />
                            ))}
                        </div>
                        
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextTestimonial}
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonials