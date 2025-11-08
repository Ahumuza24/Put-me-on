import React, { useState, useEffect } from 'react'
import { 
    Search, 
    Filter, 
    MapPin, 
    Star, 
    Mail, 
    Phone, 
    MessageSquare,
    Grid3x3,
    List,
    SlidersHorizontal,
    X,
    User,
    Clock,
    DollarSign,
    ChevronDown,
    Check
} from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from '~/components/ui/dropdown-menu'
import { Textarea } from '~/components/ui/textarea'
import { servicesStorage, type Service } from '~/lib/services-storage'
import { profileStorage, type UserProfile } from '~/lib/profile-storage'
import { useAuth } from '~/context/AuthContext'
import { useNavigate } from '@remix-run/react'

interface ServiceWithProvider extends Service {
    provider?: {
        id: string
        fullName: string
        email: string
        phone?: string
        location?: string
        rating?: number
        avatarUrl?: string
        verified?: boolean
    }
}

interface ServiceCategory {
    id: string
    name: string
    slug: string
}

const ServicesBrowse: React.FC = () => {
    const { user, profile } = useAuth()
    const navigate = useNavigate()
    const [services, setServices] = useState<ServiceWithProvider[]>([])
    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [filteredServices, setFilteredServices] = useState<ServiceWithProvider[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating' | 'location'>('relevance')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedService, setSelectedService] = useState<ServiceWithProvider | null>(null)
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [showContactModal, setShowContactModal] = useState(false)
    const [messageText, setMessageText] = useState('')
    const [sendingMessage, setSendingMessage] = useState(false)
    const [locationFilter, setLocationFilter] = useState<string>('all')

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        filterAndSortServices()
    }, [services, searchTerm, selectedCategory, sortBy, locationFilter])

    const loadData = async () => {
        setLoading(true)
        try {
            // Load categories
            const cats = await servicesStorage.getCategories()
            setCategories(cats)

            // Load services
            const svcs = await servicesStorage.getAllActive()
            
            // Load provider information for each service
            const servicesWithProviders: ServiceWithProvider[] = []
            for (const service of svcs) {
                try {
                    const providerProfile = await profileStorage.getByUserId(service.providerId)
                    servicesWithProviders.push({
                        ...service,
                        provider: providerProfile ? {
                            id: providerProfile.userId,
                            fullName: providerProfile.fullName,
                            email: providerProfile.email,
                            phone: providerProfile.phone,
                            location: providerProfile.location,
                            rating: providerProfile.rating,
                            avatarUrl: providerProfile.avatarUrl,
                            verified: providerProfile.verified
                        } : undefined
                    })
                } catch (error) {
                    // If provider not found, add service without provider info
                    servicesWithProviders.push(service)
                }
            }
            
            setServices(servicesWithProviders)
        } catch (error) {
            console.error('Error loading services:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterAndSortServices = () => {
        let filtered = [...services]

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(searchLower) ||
                service.description.toLowerCase().includes(searchLower) ||
                service.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                service.categoryName?.toLowerCase().includes(searchLower) ||
                service.provider?.fullName.toLowerCase().includes(searchLower)
            )
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(service => service.categoryId === selectedCategory)
        }

        // Filter by location
        if (locationFilter && locationFilter !== 'all') {
            const locationLower = locationFilter.toLowerCase()
            filtered = filtered.filter(service =>
                service.provider?.location?.toLowerCase().includes(locationLower)
            )
        }

        // Sort services
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price_low':
                    return a.price - b.price
                case 'price_high':
                    return b.price - a.price
                case 'rating':
                    return (b.provider?.rating || 0) - (a.provider?.rating || 0)
                case 'location':
                    // Simple alphabetical sort by location
                    const locationA = a.provider?.location || ''
                    const locationB = b.provider?.location || ''
                    return locationA.localeCompare(locationB)
                case 'relevance':
                default:
                    // Sort by featured first, then by creation date
                    if (a.featured && !b.featured) return -1
                    if (!a.featured && b.featured) return 1
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        setFilteredServices(filtered)
    }

    const formatCurrency = (amount: number) => {
        return `UGX ${amount.toLocaleString()}`
    }

    const handleMessageProvider = (service: ServiceWithProvider) => {
        if (!user || !profile) {
            navigate('/login?redirect=/services')
            return
        }
        setSelectedService(service)
        setShowMessageModal(true)
    }

    const handleViewContact = (service: ServiceWithProvider) => {
        setSelectedService(service)
        setShowContactModal(true)
    }

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedService || !user) return

        setSendingMessage(true)
        try {
            // In a real app, you'd send this message via your messaging API
            // For now, we'll simulate it
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Navigate to messages or show success
            alert(`Message sent to ${selectedService.provider?.fullName}!`)
            setShowMessageModal(false)
            setMessageText('')
            setSelectedService(null)
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message. Please try again.')
        } finally {
            setSendingMessage(false)
        }
    }

    const getUniqueLocations = () => {
        const locations = new Set<string>()
        services.forEach(service => {
            if (service.provider?.location) {
                locations.add(service.provider.location)
            }
        })
        return Array.from(locations).sort()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-muted/50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
                    <p className="text-muted-foreground">
                        Find the perfect service provider for your needs
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters and Search */}
                <div className="space-y-4 mb-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search services, providers, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 text-lg"
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Location Filter */}
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {getUniqueLocations().map(location => (
                                    <SelectItem key={location} value={location}>
                                        {location}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevance">Relevance</SelectItem>
                                <SelectItem value="price_low">Price: Low to High</SelectItem>
                                <SelectItem value="price_high">Price: High to Low</SelectItem>
                                <SelectItem value="rating">Highest Rated</SelectItem>
                                <SelectItem value="location">Location</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Mode Toggle */}
                        <div className="flex items-center border rounded-lg">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="rounded-r-none"
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="rounded-l-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || selectedCategory !== 'all' || (locationFilter && locationFilter !== 'all')) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('all')
                                    setLocationFilter('all')
                                }}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Results Count */}
                    <div className="text-sm text-muted-foreground">
                        Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Services Grid/List */}
                {filteredServices.length === 0 ? (
                    <Card className="p-12 text-center">
                        <CardContent>
                            <p className="text-lg text-muted-foreground mb-4">
                                No services found matching your criteria.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm('')
                                    setSelectedCategory('all')
                                    setLocationFilter('all')
                                }}
                            >
                                Clear Filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }>
                        {filteredServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                                viewMode={viewMode}
                                onMessage={() => handleMessageProvider(service)}
                                onViewContact={() => handleViewContact(service)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Message Modal */}
            {showMessageModal && selectedService && (
                <MessageModal
                    service={selectedService}
                    message={messageText}
                    onMessageChange={setMessageText}
                    onSend={handleSendMessage}
                    onClose={() => {
                        setShowMessageModal(false)
                        setMessageText('')
                        setSelectedService(null)
                    }}
                    sending={sendingMessage}
                />
            )}

            {/* Contact Modal */}
            {showContactModal && selectedService && (
                <ContactModal
                    service={selectedService}
                    onClose={() => {
                        setShowContactModal(false)
                        setSelectedService(null)
                    }}
                />
            )}
        </div>
    )
}

// Service Card Component
interface ServiceCardProps {
    service: ServiceWithProvider
    viewMode: 'grid' | 'list'
    onMessage: () => void
    onViewContact: () => void
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, viewMode, onMessage, onViewContact }) => {
    const formatCurrency = (amount: number) => {
        return `UGX ${amount.toLocaleString()}`
    }

    if (viewMode === 'list') {
        return (
            <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        {service.images && service.images.length > 0 && (
                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                    src={service.images[0]}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="text-xl font-semibold">{service.title}</h3>
                                        {service.featured && (
                                            <Badge variant="default">Featured</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                        <span className="flex items-center">
                                            <User className="h-4 w-4 mr-1" />
                                            {service.provider?.fullName || 'Unknown Provider'}
                                        </span>
                                        {service.provider?.location && (
                                            <span className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {service.provider.location}
                                            </span>
                                        )}
                                        {service.provider?.rating && (
                                            <span className="flex items-center">
                                                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                                                {service.provider.rating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(service.price)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {service.priceType === 'hourly' ? '/hour' : service.priceType === 'package' ? '/package' : 'fixed'}
                                    </div>
                                </div>
                            </div>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                                {service.description}
                            </p>
                            {service.tags && service.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {service.tags.slice(0, 4).map((tag, index) => (
                                        <Badge key={index} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <Button onClick={onMessage} size="sm">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                </Button>
                                <Button onClick={onViewContact} variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contact
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
            {service.images && service.images.length > 0 && (
                <div className="w-full h-48 overflow-hidden bg-muted">
                    <img
                        src={service.images[0]}
                        alt={service.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            {service.featured && (
                                <Badge variant="default">Featured</Badge>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {service.provider?.location && (
                                <span className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {service.provider.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {service.provider?.rating && (
                            <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{service.provider.rating.toFixed(1)}</span>
                            </div>
                        )}
                        {service.provider?.verified && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold">
                            {formatCurrency(service.price)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {service.priceType === 'hourly' ? '/hour' : service.priceType === 'package' ? '/package' : 'fixed'}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <CardDescription className="line-clamp-2 mb-4">
                    {service.description}
                </CardDescription>
                {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {service.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                    </div>
                )}
                <div className="mt-auto flex items-center space-x-2">
                    <Button onClick={onMessage} size="sm" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                    </Button>
                    <Button onClick={onViewContact} variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Message Modal Component
interface MessageModalProps {
    service: ServiceWithProvider
    message: string
    onMessageChange: (message: string) => void
    onSend: () => void
    onClose: () => void
    sending: boolean
}

const MessageModal: React.FC<MessageModalProps> = ({ 
    service, 
    message, 
    onMessageChange, 
    onSend, 
    onClose, 
    sending 
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Message {service.provider?.fullName}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        About: {service.title}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Your Message</label>
                        <Textarea
                            value={message}
                            onChange={(e) => onMessageChange(e.target.value)}
                            placeholder="Hi, I'm interested in your service..."
                            rows={6}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose} disabled={sending}>
                            Cancel
                        </Button>
                        <Button onClick={onSend} disabled={!message.trim() || sending}>
                            {sending ? 'Sending...' : 'Send Message'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Contact Modal Component
interface ContactModalProps {
    service: ServiceWithProvider
    onClose: () => void
}

const ContactModal: React.FC<ContactModalProps> = ({ service, onClose }) => {
    const provider = service.provider

    if (!provider) {
        return null
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Contact Information</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardDescription>
                        {provider.fullName}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Email</p>
                                <a 
                                    href={`mailto:${provider.email}`}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {provider.email}
                                </a>
                            </div>
                        </div>
                        {provider.phone && (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <a 
                                        href={`tel:${provider.phone}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {provider.phone}
                                    </a>
                                </div>
                            </div>
                        )}
                        {provider.location && (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Location</p>
                                    <p className="text-sm text-muted-foreground">{provider.location}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pt-4 border-t">
                        <Button onClick={onClose} className="w-full">
                            Close
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ServicesBrowse

