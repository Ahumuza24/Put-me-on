import { Link, useLocation } from '@remix-run/react'
import NavbarUserAvatar from '~/components/NavbarUserAvatar'

const Navbar = () => {
    const location = useLocation()
    const isServicesPage = location.pathname === '/services'
    const isLandingPage = location.pathname === '/'

    return (
        <div className='sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm'>
            <nav className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-5 sm:py-3'>
                <div className='flex items-center gap-3'>
                    <Link to='/' className='flex items-center'>
                        <img 
                            src="/Pmo.png" 
                            alt="PutMeOn logo" 
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                        />
                    </Link>
                    {isServicesPage && (
                        <h1 className='text-lg sm:text-xl md:text-2xl font-bold'>
                            Browse Services
                        </h1>
                    )}
                    {!isLandingPage && !isServicesPage && (
                        <Link 
                            to='/services' 
                            className='text-lg sm:text-xl md:text-2xl font-bold hover:text-primary transition-colors'
                        >
                            Browse Services
                        </Link>
                    )}
                </div>
                
                {/* User Avatar */}
                <div className='flex items-center'>
                    <NavbarUserAvatar />
                </div>
            </nav>
        </div>
    )
}

export default Navbar
