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
            <div className='max-w-7xl mx-auto px-5 py-16'>
                <div className='grid md:grid-cols-4 gap-8'>
                    {/* Brand Section */}
                    <div className='md:col-span-2'>
                        <Link to='/' className='flex items-center gap-2 mb-1'>
                            <img 
                                src="/Pmo.png" 
                                alt="PutMeOn logo" 
                                className="w-40 h-40 object-contain"
                            />
                           
                        </Link>
                        <p className='text-muted-foreground mb-6 max-w-md'>
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
                        <h3 className='font-semibold mb-4'>Quick Links</h3>
                        <ul className='space-y-3'>
                            {quickLinks.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link
                                        to={link.href}
                                        className='text-muted-foreground hover:text-primary transition-colors'
                                    >
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className='font-semibold mb-4'>Get in Touch</h3>
                        <div className='space-y-3 text-muted-foreground'>
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
                    className='mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4'
                >
                    <p className='text-muted-foreground text-sm'>
                        © 2025 PutMeOn. All rights reserved.
                    </p>
                    <div className='flex gap-6 text-sm text-muted-foreground'>
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
