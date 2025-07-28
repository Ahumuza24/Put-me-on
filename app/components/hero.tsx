import { motion, AnimatePresence } from 'framer-motion'
import { SearchIcon, MapPinIcon } from 'lucide-react'
import { Link } from '@remix-run/react'
import { cn } from '~/lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import useTheme from '~/hooks/use-theme'
import { useState, useEffect } from 'react'
import DotPattern from './dot-pattern'

const Hero = () => {
    const [theme] = useTheme()
    const [currentSlide, setCurrentSlide] = useState(0)

    const slides = [
        {
            title: "Hire Top Local Talent",
            subtitle: "Fast",
            description: "Connect with verified professionals in your area for any service you need"
        },
        {
            title: "Showcase Your Skills",
            subtitle: "Get Hired",
            description: "Create your profile and start earning from your expertise today"
        },
        {
            title: "Chat. Hire. Pay.",
            subtitle: "All in One Place",
            description: "Seamless communication and secure payments in one platform"
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [slides.length])



    return (
        <main className='relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-center gap-8 px-5 text-center lg:my-0'>
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
                />
            </div>
            {/* Full-width Dot Pattern Background */}
            <div className="absolute inset-0 w-screen left-1/2 transform -translate-x-1/2 pointer-events-none">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn(
                        'fill-primary/30 [mask-image:linear-gradient(to_bottom,transparent,white,white,transparent,transparent)]'
                    )}
                />
            </div>

            {/* Hero Content with Slideshow */}
            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <motion.h1
                            className={cn(
                                'scroll-m-20 font-inter text-4xl font-extrabold tracking-tight lg:text-6xl'
                            )}
                        >
                            <span className='bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent'>
                                {slides[currentSlide].title}
                            </span>{' '}
                            <span
                                className={cn(
                                    'relative bg-gradient-to-r from-primary bg-clip-text text-5xl font-extrabold text-transparent lg:text-7xl',
                                    theme === 'orange' && 'to-rose-600',
                                    theme === 'blue' && 'to-purple-600',
                                    theme === 'green' && 'to-emerald-600',
                                    theme === 'red' && 'to-rose-600',
                                    theme === 'yellow' && 'to-yellow-600',
                                    theme === 'violet' && 'to-violet-600',
                                    theme === 'gray' && 'to-gray-600',
                                    theme === 'neutral' && 'to-neutral-600',
                                    theme === 'slate' && 'to-slate-600',
                                    theme === 'stone' && 'to-stone-600',
                                    theme === 'zinc' && 'to-zinc-600',
                                    theme === 'rose' && 'to-pink-600'
                                )}
                            >
                                {slides[currentSlide].subtitle}
                            </span>
                        </motion.h1>

                        <motion.p
                            className='text-lg text-muted-foreground max-w-2xl mx-auto'
                        >
                            {slides[currentSlide].description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>



                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                >
                    <Button size="lg" className="text-lg px-8 py-6" asChild>
                        <Link to="/signup">Find Services</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                        <Link to="/signup">Become a Provider</Link>
                    </Button>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="max-w-4xl mx-auto mt-12"
                >
                    <div className="flex flex-col md:flex-row gap-4 p-6 bg-background/50 backdrop-blur-sm border rounded-2xl shadow-lg">
                        <div className="flex-1">
                            <Select>
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Select service category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="web-dev">Web Development</SelectItem>
                                    <SelectItem value="design">Graphic Design</SelectItem>
                                    <SelectItem value="events">Events & Weddings</SelectItem>
                                    <SelectItem value="writing">Content Writing</SelectItem>
                                    <SelectItem value="photography">Photography</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 relative">
                            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Enter your location"
                                className="h-12 pl-10"
                            />
                        </div>

                        <Button size="lg" className="h-12 px-8">
                            <SearchIcon className="h-5 w-5 mr-2" />
                            Search
                        </Button>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}

export default Hero
