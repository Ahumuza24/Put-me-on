import { motion } from 'framer-motion'
import { Link } from '@remix-run/react'
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react'
import Saastellar from './icons/saasstellar'

const Footer = () => {
    const quickLinks = [
        { name: 'About', href: '/about' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Help Center', href: '/help' },
        { name: 'Blog', href: '/blog' }
    ]

    const socialLinks = [
        { icon: FacebookIcon, href: '#', label: 'Facebook' },
        { icon: TwitterIcon, href: '#', label: 'Twitter' },
        { icon: InstagramIcon, href: '#', label: 'Instagram' },
        { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
        { icon: YoutubeIcon, href: '#', label: 'YouTube' }
    ]

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='bg-background border-t'
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-5 py-12 sm:py-16'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12'>
                    {/* Brand Section */}
                    <div className='sm:col-span-2 lg:col-span-2'>
                        <Link to='/' className='flex items-center gap-2 mb-4'>
                            <img
                                src="/Pmo.png"
                                alt="PutMeOn logo"
                                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
                            />
                        </Link>
                        <p className='text-muted-foreground mb-6 max-w-md text-sm sm:text-base'>
                            Connect with top local talent for all your service needs. From web development to event planning, find verified professionals in your area.
                        </p>

                        {/* Social Links */}
                        <div className='flex gap-4'>
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors'
                                >
                                    <social.icon className='w-5 h-5' />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='font-semibold mb-4 text-sm sm:text-base'>Quick Links</h3>
                        <ul className='space-y-2 sm:space-y-3'>
                            {quickLinks.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={link.href}
                                        className='text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base'
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className='font-semibold mb-4 text-sm sm:text-base'>Get in Touch</h3>
                        <div className='space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base'>
                            <p>support@putmeon.com</p>
                            <p>+256 712 345 678</p>
                            <p>Plot 394</p>
                            <p>Muyenga Hill Drive</p>
                            <p>Kampala - Uganda</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className='mt-8 sm:mt-12 pt-6 sm:pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4'
                >
                    <p className='text-muted-foreground text-xs sm:text-sm text-center sm:text-left'>
                        © 2025 PutMeOn. All rights reserved.
                    </p>
                    <div className='flex gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground'>
                        <Link to='/terms' className='hover:text-primary transition-colors'>
                            Terms
                        </Link>
                        <Link to='/privacy' className='hover:text-primary transition-colors'>
                            Privacy
                        </Link>
                        <Link to='/cookies' className='hover:text-primary transition-colors'>
                            Cookies
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer
