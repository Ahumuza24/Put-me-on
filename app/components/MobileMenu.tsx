import { useState, useEffect } from 'react'
import { Link, useLocation } from '@remix-run/react'
import { Menu, X } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '~/lib/utils'

interface MobileMenuProps {
    isOpen: boolean
    onToggle: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
    const location = useLocation()

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'How it Works', href: '/how-it-works' },
        { name: 'Browse Services', href: '/browse' },
        { name: 'Become a Provider', href: '/become-provider' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="md:hidden"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Menu className="h-6 w-6" />
                )}
            </Button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={onToggle}
                    />
                    <div
                        className={cn(
                            "fixed top-0 right-0 z-50 h-full w-80 bg-background border-l shadow-xl transform transition-transform duration-300 ease-in-out md:hidden",
                            isOpen ? "translate-x-0" : "translate-x-full"
                        )}
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <Link to="/" className="flex items-center gap-2" onClick={onToggle}>
                                    <img
                                        src="/Pmo.png"
                                        alt="PutMeOn logo"
                                        className="w-10 h-10 object-contain"
                                    />
                                    <span className="text-lg font-semibold">PutMeOn</span>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onToggle}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 overflow-y-auto p-4">
                                <ul className="space-y-2">
                                    {navItems.map((item) => {
                                        const isActive = location.pathname === item.href
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    to={item.href}
                                                    onClick={onToggle}
                                                    className={cn(
                                                        "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                                                        isActive
                                                            ? "bg-primary text-primary-foreground"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>

                            {/* Actions */}
                            <div className="p-4 border-t space-y-3">
                                <Button
                                    asChild
                                    className="w-full"
                                    onClick={onToggle}
                                >
                                    <Link to="/signup">Get Started</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                    onClick={onToggle}
                                >
                                    <Link to="/login">Login</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default MobileMenu

