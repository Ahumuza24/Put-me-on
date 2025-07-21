import { Link } from '@remix-run/react'

const Navbar = () => {
    return (
        <div className='sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b px-5 py-2 shadow-sm'>
            <nav className='mx-auto flex max-w-7xl items-center justify-between'>
                <Link to='/' className='flex items-center gap-2'>
                    <img 
                        src="/Pmo.png" 
                        alt="PutMeOn logo" 
                        className="w-12 h-12 object-contain"
                    />
                    <span className='hidden text-lg font-semibold md:block'>
                        PutMeOn
                    </span>
                </Link>
                <div className='hidden md:flex items-center space-x-8'>
                    <Link to='/' className='text-sm font-medium hover:text-primary transition-colors'>
                        Home
                    </Link>
                    <Link to='/how-it-works' className='text-sm font-medium hover:text-primary transition-colors'>
                        How it Works
                    </Link>
                    <Link to='/browse' className='text-sm font-medium hover:text-primary transition-colors'>
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
                <div className='flex items-center gap-3'>
                    <Link 
                        to='/signup' 
                        className='hidden sm:inline-flex h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors'
                    >
                        Get Started
                    </Link>
                    
                    <Link 
                        to='/login' 
                        className='hidden sm:inline-flex h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors'
                    >
                        Login
                    </Link>

                </div>
            </nav>
        </div>
    )
}

export default Navbar
