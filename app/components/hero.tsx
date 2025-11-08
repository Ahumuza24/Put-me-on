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
        <main className='relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-center gap-6 sm:gap-8 px-4 sm:px-5 text-center py-8 sm:py-12 lg:py-0'>
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-10 left-4 sm:top-20 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full blur-xl"
                />
                <div
                    className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-primary/5 rounded-full blur-2xl"
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
                    <div
                        key={currentSlide}
                        className="space-y-4 sm:space-y-6"
                    >
                        <h1
                            className={cn(
                                'scroll-m-20 font-inter text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight px-2'
                            )}
                        >
                            <span className='bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent block sm:inline'>
                                {slides[currentSlide].title}
                            </span>{' '}
                            <span
                                className={cn(
                                    'relative bg-gradient-to-r from-primary bg-clip-text block sm:inline text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-transparent mt-2 sm:mt-0',
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
                        </h1>

                        <p
                            className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4'
                        >
                            {slides[currentSlide].description}
                        </p>
                    </div>



                {/* CTA Buttons */}
                <div
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 px-4"
                >
                    <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto" asChild>
                        <Link to="/signup">Get Started</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto" asChild>
                        <Link to="/become-provider">Become a Provider</Link>
                    </Button>
                </div>

                {/* Search Bar */}
                <div
                    className="max-w-4xl mx-auto mt-8 sm:mt-12 px-4"
                >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-6 bg-background/50 backdrop-blur-sm border rounded-xl sm:rounded-2xl shadow-lg">
                        <div className="flex-1 w-full">
                            <Select>
                                <SelectTrigger className="h-11 sm:h-12">
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

                        <div className="flex-1 w-full relative">
                            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                            <Input
                                placeholder="Enter your city"
                                className="h-11 sm:h-12 pl-9 sm:pl-10 text-sm sm:text-base"
                            />
                        </div>

                        <Button size="lg" className="h-11 sm:h-12 px-6 sm:px-8 w-full sm:w-auto">
                            <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                            <span className="text-sm sm:text-base">Search</span>
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Hero
