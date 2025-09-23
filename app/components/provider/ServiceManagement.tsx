import React, { useState, useEffect } from 'react'
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff, 
    DollarSign, 
    Clock, 
    Star,
    MoreVertical,
    Search,
    Filter,
    Grid,
    List
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Switch } from '~/components/ui/switch'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '~/components/ui/dropdown-menu'
import ProviderLayout from './ProviderLayout'
import UserAvatar from './UserAvatar'
import { useAuth } from '~/context/AuthContext'

interface ServiceManagementProps {
    // No props needed - will use useAuth hook internally
}

interface Service {
    id: number
    title: string
    description: string
    category: string
    price: number
    priceType: 'hourly' | 'fixed'
    duration: string
    status: 'active' | 'inactive' | 'draft'
    views: number
    bookings: number
    rating: number
    tags: string[]
    images: string[]
    createdAt: string
}

const ServiceManagement: React.FC<ServiceManagementProps> = () => {
    const { user, profile } = useAuth()
    const [services, setServices] = useState<Service[]>([])
    const [isCreating, setIsCreating] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [loading, setLoading] = useState(false)

    // Mock data - in real app, this would come from API
    useEffect(() => {
        setServices([
            {
                id: 1,
                title: 'Custom Website Development',
                description: 'I will create a modern, responsive website tailored to your business needs using React and Node.js.',
                category: 'web-dev',
                price: 5700000,
                priceType: 'fixed',
                duration: '7-14 days',
                status: 'active',
                views: 234,
                bookings: 12,
                rating: 4.8,
                tags: ['React', 'Node.js', 'MongoDB', 'Responsive'],
                images: [],
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                title: 'Logo Design Package',
                description: 'Professional logo design with 3 concepts, unlimited revisions, and all file formats included.',
                category: 'design',
                price: 285000,
                priceType: 'hourly',
                duration: '3-5 days',
                status: 'active',
                views: 156,
                bookings: 8,
                rating: 4.9,
                tags: ['Logo Design', 'Branding', 'Adobe Illustrator'],
                images: [],
                createdAt: '2024-01-05'
            },
            {
                id: 3,
                title: 'E-commerce Store Setup',
                description: 'Complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
                category: 'web-dev',
                price: 9500000,
                priceType: 'fixed',
                duration: '14-21 days',
                status: 'draft',
                views: 0,
                bookings: 0,
                rating: 0,
                tags: ['E-commerce', 'Shopify', 'Payment Integration'],
                images: [],
                createdAt: '2024-01-10'
            }
        ])
    }, [])

    const [newService, setNewService] = useState<Partial<Service>>({
        title: '',
        description: '',
        category: '',
        price: 0,
        priceType: 'hourly',
        duration: '',
        tags: [],
        status: 'draft'
    })

    const [newTag, setNewTag] = useState('')

    const handleCreateService = async () => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const service: Service = {
                id: Date.now(),
                title: newService.title || '',
                description: newService.description || '',
                category: newService.category || '',
                price: newService.price || 0,
                priceType: newService.priceType || 'hourly',
                duration: newService.duration || '',
                status: 'draft',
                views: 0,
                bookings: 0,
                rating: 0,
                tags: newService.tags || [],
                images: [],
                createdAt: new Date().toISOString().split('T')[0]
            }
            
            setServices(prev => [service, ...prev])
            setNewService({
                title: '',
                description: '',
                category: '',
                price: 0,
                priceType: 'hourly',
                duration: '',
                tags: [],
                status: 'draft'
            })
            setIsCreating(false)
        } catch (error) {
            console.error('Error creating service:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateService = async (service: Service) => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setServices(prev => prev.map(s => s.id === service.id ? service : s))
            setEditingService(null)
        } catch (error) {
            console.error('Error updating service:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteService = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setLoading(true)
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000))
                
                setServices(prev => prev.filter(s => s.id !== id))
            } catch (error) {
                console.error('Error deleting service:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    const toggleServiceStatus = async (service: Service) => {
        const updatedService = {
            ...service,
            status: service.status === 'active' ? 'inactive' : 'active'
        }
        await handleUpdateService(updatedService)
    }

    const addTag = () => {
        if (newTag.trim() && !newService.tags?.includes(newTag.trim())) {
            setNewService(prev => ({
                ...prev,
                tags: [...(prev.tags || []), newTag.trim()]
            }))
            setNewTag('')
        }
    }

    const removeTag = (tag: string) => {
        setNewService(prev => ({
            ...prev,
            tags: prev.tags?.filter(t => t !== tag) || []
        }))
    }

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'all' || service.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }

    const actions = (
        <div className="flex items-center space-x-4">
            <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
            </Button>
            <UserAvatar />
        </div>
    )

    return (
        <ProviderLayout
            title="My Services"
            description="Manage your service listings"
            actions={actions}
        >
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="web-dev">Web Development</SelectItem>
                            <SelectItem value="design">Graphic Design</SelectItem>
                            <SelectItem value="events">Events & Weddings</SelectItem>
                            <SelectItem value="writing">Content Writing</SelectItem>
                            <SelectItem value="photography">Photography & Video</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Services Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                            >
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{service.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {service.description}
                                                </CardDescription>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => setEditingService(service)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toggleServiceStatus(service)}>
                                                        {service.status === 'active' ? (
                                                            <>
                                                                <EyeOff className="h-4 w-4 mr-2" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-semibold">
                                                    UGX {service.price.toLocaleString()}
                                                    {service.priceType === 'hourly' ? '/hr' : ''}
                                                </span>
                                            </div>
                                            <Badge className={getStatusColor(service.status)}>
                                                {service.status}
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{service.duration}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{service.views}</span>
                                            </div>
                                        </div>

                                        {service.rating > 0 && (
                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span className="text-sm">{service.rating}</span>
                                                <span className="text-sm text-muted-foreground">({service.bookings} bookings)</span>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-1">
                                            {service.tags.slice(0, 3).map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {service.tags.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{service.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center space-x-4">
                                                    <h3 className="text-lg font-semibold">{service.title}</h3>
                                                    <Badge className={getStatusColor(service.status)}>
                                                        {service.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground line-clamp-2">
                                                    {service.description}
                                                </p>
                                                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                                    <div className="flex items-center space-x-1">
                                                        <DollarSign className="h-4 w-4" />
                                                        <span>UGX {service.price.toLocaleString()}{service.priceType === 'hourly' ? '/hr' : ''}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{service.duration}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="h-4 w-4" />
                                                        <span>{service.views} views</span>
                                                    </div>
                                                    {service.rating > 0 && (
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                            <span>{service.rating} ({service.bookings} bookings)</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleServiceStatus(service)}
                                                >
                                                    {service.status === 'active' ? (
                                                        <>
                                                            <EyeOff className="h-4 w-4 mr-2" />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Activate
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditingService(service)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}

                {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            {searchTerm || filterCategory !== 'all' 
                                ? 'No services match your search criteria'
                                : 'You haven\'t created any services yet'
                            }
                        </div>
                        <Button onClick={() => setIsCreating(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Service
                        </Button>
                    </div>
                )}

            {/* Create/Edit Service Modal */}
            {(isCreating || editingService) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div
                        className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {isCreating ? 'Create New Service' : 'Edit Service'}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Service Title</Label>
                                <Input
                                    id="title"
                                    value={isCreating ? newService.title : editingService?.title}
                                    onChange={(e) => {
                                        if (isCreating) {
                                            setNewService(prev => ({ ...prev, title: e.target.value }))
                                        } else if (editingService) {
                                            setEditingService(prev => prev ? { ...prev, title: e.target.value } : null)
                                        }
                                    }}
                                    placeholder="Enter service title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={isCreating ? newService.description : editingService?.description}
                                    onChange={(e) => {
                                        if (isCreating) {
                                            setNewService(prev => ({ ...prev, description: e.target.value }))
                                        } else if (editingService) {
                                            setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)
                                        }
                                    }}
                                    placeholder="Describe your service in detail"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={isCreating ? newService.category : editingService?.category}
                                        onValueChange={(value) => {
                                            if (isCreating) {
                                                setNewService(prev => ({ ...prev, category: value }))
                                            } else if (editingService) {
                                                setEditingService(prev => prev ? { ...prev, category: value } : null)
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="web-dev">Web Development</SelectItem>
                                            <SelectItem value="design">Graphic Design</SelectItem>
                                            <SelectItem value="events">Events & Weddings</SelectItem>
                                            <SelectItem value="writing">Content Writing</SelectItem>
                                            <SelectItem value="photography">Photography & Video</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={isCreating ? newService.duration : editingService?.duration}
                                        onChange={(e) => {
                                            if (isCreating) {
                                                setNewService(prev => ({ ...prev, duration: e.target.value }))
                                            } else if (editingService) {
                                                setEditingService(prev => prev ? { ...prev, duration: e.target.value } : null)
                                            }
                                        }}
                                        placeholder="e.g., 3-5 days"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={isCreating ? newService.price : editingService?.price}
                                        onChange={(e) => {
                                            if (isCreating) {
                                                setNewService(prev => ({ ...prev, price: Number(e.target.value) }))
                                            } else if (editingService) {
                                                setEditingService(prev => prev ? { ...prev, price: Number(e.target.value) } : null)
                                            }
                                        }}
                                        placeholder="Enter price"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="priceType">Price Type</Label>
                                    <Select
                                        value={isCreating ? newService.priceType : editingService?.priceType}
                                        onValueChange={(value: 'hourly' | 'fixed') => {
                                            if (isCreating) {
                                                setNewService(prev => ({ ...prev, priceType: value }))
                                            } else if (editingService) {
                                                setEditingService(prev => prev ? { ...prev, priceType: value } : null)
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select price type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="fixed">Fixed Price</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(isCreating ? newService.tags : editingService?.tags || []).map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                                            <span>{tag}</span>
                                            <button
                                                onClick={() => {
                                                    if (isCreating) {
                                                        removeTag(tag)
                                                    } else if (editingService) {
                                                        setEditingService(prev => prev ? {
                                                            ...prev,
                                                            tags: prev.tags.filter(t => t !== tag)
                                                        } : null)
                                                    }
                                                }}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <Input
                                        placeholder="Add a tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button onClick={addTag} size="sm">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreating(false)
                                    setEditingService(null)
                                    setNewService({
                                        title: '',
                                        description: '',
                                        category: '',
                                        price: 0,
                                        priceType: 'hourly',
                                        duration: '',
                                        tags: [],
                                        status: 'draft'
                                    })
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    if (isCreating) {
                                        handleCreateService()
                                    } else if (editingService) {
                                        handleUpdateService(editingService)
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isCreating ? 'Create Service' : 'Update Service')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    )
}

export default ServiceManagement
