import { useState } from 'react'
import { Link } from '@remix-run/react'
import ThemeSwitcher from '~/components/theme-switcher'
import MobileMenu from '~/components/MobileMenu'

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className='sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm'>
            <nav className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-3'>
                <Link to='/' className='flex items-center gap-2'>
                    <img 
                        src="/Pmo.png" 
                        alt="PutMeOn logo" 
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                    />
                    {/* <span className='text-base sm:text-lg font-semibold'>
                        PutMeOn
                    </span> */}
                </Link>
                
                {/* Desktop Navigation */}
                <div className='hidden lg:flex items-center space-x-6 xl:space-x-8'>
                    <Link to='/' className='text-sm font-medium hover:text-primary transition-colors'>
                        Home
                    </Link>
                    <Link to='/how-it-works' className='text-sm font-medium hover:text-primary transition-colors'>
                        How it Works
                    </Link>
                    <Link to='/services' className='text-sm font-medium hover:text-primary transition-colors'>
                        Browse Services
                    </Link>
                    <Link to='/become-provider' className='text-sm font-medium hover:text-primary transition-colors'>
                        Become a Provider
                    </Link>
                    <Link to='/about' className='text-sm font-medium hover:text-primary transition-colors'>
                        About Us
                    </Link>
                    <Link to='/contact' className='text-sm font-medium hover:text-primary transition-colors'>
                        Contact
                    </Link>
                </div>
                
                {/* Desktop Actions */}
                <div className='hidden lg:flex items-center gap-3'>
                    <ThemeSwitcher />
                    <Link 
                        to='/signup' 
                        className='inline-flex h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors'
                    >
                        Get Started
                    </Link>
                    <Link 
                        to='/login' 
                        className='inline-flex h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors'
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Actions */}
                <div className='flex lg:hidden items-center gap-2'>
                    <ThemeSwitcher />
                    <MobileMenu 
                        isOpen={mobileMenuOpen} 
                        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    />
                </div>
            </nav>
        </div>
    )
}

export default Navbar
