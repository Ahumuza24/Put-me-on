import React, { useState, useEffect } from 'react'
import { 
    Briefcase, 
    Search, 
    Filter,
    CheckCircle,
    XCircle,
    Star,
    Eye,
    EyeOff,
    Trash2,
    MoreVertical,
    AlertCircle
} from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '~/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { servicesStorage, type Service } from '~/lib/services-storage'
import { profileStorage } from '~/lib/profile-storage'
import { ServiceCardSkeleton, Skeleton } from '~/components/ui/skeletons'

const AdminServiceManagement: React.FC = () => {
    const [services, setServices] = useState<Service[]>([])
    const [filteredServices, setFilteredServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
    const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all')

    useEffect(() => {
        loadServices()
    }, [])

    useEffect(() => {
        filterServices()
    }, [services, searchTerm, filterStatus, filterFeatured])

    const loadServices = async () => {
        setLoading(true)
        try {
            const allServices = await servicesStorage.getAll()
            setServices(allServices)
        } catch (error) {
            console.error('Error loading services:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterServices = () => {
        let filtered = [...services]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by status
        if (filterStatus === 'active') {
            filtered = filtered.filter(service => service.isActive)
        } else if (filterStatus === 'inactive') {
            filtered = filtered.filter(service => !service.isActive)
        }

        // Filter by featured
        if (filterFeatured === 'featured') {
            filtered = filtered.filter(service => service.featured)
        } else if (filterFeatured === 'not-featured') {
            filtered = filtered.filter(service => !service.featured)
        }

        setFilteredServices(filtered)
    }

    const handleApproveService = async (serviceId: string) => {
        try {
            await servicesStorage.update(serviceId, { isActive: true })
            await loadServices()
        } catch (error) {
            console.error('Error approving service:', error)
        }
    }

    const handleDeactivateService = async (serviceId: string) => {
        try {
            await servicesStorage.update(serviceId, { isActive: false })
            await loadServices()
        } catch (error) {
            console.error('Error deactivating service:', error)
        }
    }

    const handleFeatureService = async (serviceId: string) => {
        try {
            await servicesStorage.update(serviceId, { featured: true })
            await loadServices()
        } catch (error) {
            console.error('Error featuring service:', error)
        }
    }

    const handleUnfeatureService = async (serviceId: string) => {
        try {
            await servicesStorage.update(serviceId, { featured: false })
            await loadServices()
        } catch (error) {
            console.error('Error unfeaturing service:', error)
        }
    }

    const handleDeleteService = async (serviceId: string) => {
        if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
            try {
                await servicesStorage.delete(serviceId)
                await loadServices()
            } catch (error) {
                console.error('Error deleting service:', error)
            }
        }
    }

    const formatCurrency = (amount: number) => {
        return `UGX ${amount.toLocaleString()}`
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ServiceCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Service Management</h2>
                <p className="text-muted-foreground">
                    Manage all services, approve, feature, or remove services from the platform.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{services.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {services.filter(s => s.isActive).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Featured Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {services.filter(s => s.featured).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {services.filter(s => !s.isActive).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
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
                        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterFeatured} onValueChange={(value: any) => setFilterFeatured(value)}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Featured" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Services</SelectItem>
                                <SelectItem value="featured">Featured</SelectItem>
                                <SelectItem value="not-featured">Not Featured</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Services List */}
            <Card>
                <CardHeader>
                    <CardTitle>Services ({filteredServices.length})</CardTitle>
                    <CardDescription>Manage service listings and visibility</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start space-x-4 flex-1 min-w-0">
                                    {service.images && service.images.length > 0 && (
                                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={service.images[0]}
                                                alt={service.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-medium truncate">{service.title}</h3>
                                            {service.featured && (
                                                <Badge variant="default" className="bg-blue-600">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Featured
                                                </Badge>
                                            )}
                                            {service.isActive ? (
                                                <Badge variant="outline" className="text-green-600 border-green-600">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Inactive
                                                </Badge>
                                            )}
                                            {service.categoryName && (
                                                <Badge variant="secondary">{service.categoryName}</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                            {service.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">
                                                {formatCurrency(service.price)}
                                                {service.priceType === 'hourly' && '/hr'}
                                            </span>
                                            {service.durationHours && (
                                                <span>Duration: {service.durationHours} hours</span>
                                            )}
                                            <span>
                                                Created: {new Date(service.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {!service.isActive && (
                                            <DropdownMenuItem onClick={() => handleApproveService(service.id)}>
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve & Activate
                                            </DropdownMenuItem>
                                        )}
                                        {service.isActive && (
                                            <DropdownMenuItem onClick={() => handleDeactivateService(service.id)}>
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Deactivate
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {!service.featured && (
                                            <DropdownMenuItem onClick={() => handleFeatureService(service.id)}>
                                                <Star className="h-4 w-4 mr-2" />
                                                Feature Service
                                            </DropdownMenuItem>
                                        )}
                                        {service.featured && (
                                            <DropdownMenuItem onClick={() => handleUnfeatureService(service.id)}>
                                                <Star className="h-4 w-4 mr-2" />
                                                Remove from Featured
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => handleDeleteService(service.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Service
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                        {filteredServices.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No services found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminServiceManagement

