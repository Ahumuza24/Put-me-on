import React, { useState, useEffect } from 'react'
import { 
    Calendar, 
    Search, 
    Filter,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    MoreVertical,
    MessageSquare,
    DollarSign
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
import { Textarea } from '~/components/ui/textarea'
import { bookingsStorage, type Booking } from '~/lib/bookings-storage'
import { BookingCardSkeleton, Skeleton } from '~/components/ui/skeletons'

const AdminBookingManagement: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | Booking['status']>('all')
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [disputeResolution, setDisputeResolution] = useState('')

    useEffect(() => {
        loadBookings()
    }, [])

    useEffect(() => {
        filterBookings()
    }, [bookings, searchTerm, filterStatus])

    const loadBookings = async () => {
        setLoading(true)
        try {
            const allBookings = await bookingsStorage.getAll()
            setBookings(allBookings)
        } catch (error) {
            console.error('Error loading bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterBookings = () => {
        let filtered = [...bookings]

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.provider?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.service?.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(booking => booking.status === filterStatus)
        }

        setFilteredBookings(filtered)
    }

    const handleUpdateStatus = async (bookingId: string, status: Booking['status']) => {
        try {
            await bookingsStorage.updateStatus(bookingId, status)
            await loadBookings()
        } catch (error) {
            console.error('Error updating booking status:', error)
        }
    }

    const handleResolveDispute = async (bookingId: string, resolution: string) => {
        if (!resolution.trim()) {
            alert('Please provide a resolution note')
            return
        }
        try {
            // In a real app, you'd have a dispute resolution method
            // For now, we'll update the status and add notes
            await bookingsStorage.updateStatus(bookingId, 'completed', resolution)
            setSelectedBooking(null)
            setDisputeResolution('')
            await loadBookings()
        } catch (error) {
            console.error('Error resolving dispute:', error)
        }
    }

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            case 'accepted':
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            case 'disputed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
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
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <BookingCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Booking Management</h2>
                <p className="text-muted-foreground">
                    Monitor all bookings, resolve disputes, and manage booking statuses.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {bookings.filter(b => b.status === 'pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {bookings.filter(b => b.status === 'in_progress').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {bookings.filter(b => b.status === 'completed').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Disputed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {bookings.filter(b => b.status === 'disputed').length}
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
                                    placeholder="Search bookings..."
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
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="disputed">Disputed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bookings List */}
            <Card>
                <CardHeader>
                    <CardTitle>Bookings ({filteredBookings.length})</CardTitle>
                    <CardDescription>Manage and resolve booking issues</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="font-medium">{booking.title}</h3>
                                            <Badge className={getStatusColor(booking.status)}>
                                                {booking.status}
                                            </Badge>
                                            {booking.status === 'disputed' && (
                                                <Badge variant="destructive">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Dispute
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground mb-1">
                                                    <span className="font-medium">Client:</span> {booking.client?.fullName || 'Unknown'}
                                                </p>
                                                <p className="text-muted-foreground mb-1">
                                                    <span className="font-medium">Provider:</span> {booking.provider?.fullName || 'Unknown'}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    <span className="font-medium">Service:</span> {booking.service?.title || 'Unknown'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">
                                                    <span className="font-medium">Budget:</span> {formatCurrency(booking.budget)}
                                                </p>
                                                {booking.startDate && (
                                                    <p className="text-muted-foreground mb-1">
                                                        <span className="font-medium">Start:</span> {new Date(booking.startDate).toLocaleDateString()}
                                                    </p>
                                                )}
                                                <p className="text-muted-foreground">
                                                    <span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        {booking.clientNotes && (
                                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                                                <p className="font-medium mb-1">Client Notes:</p>
                                                <p className="text-muted-foreground">{booking.clientNotes}</p>
                                            </div>
                                        )}
                                        {booking.providerNotes && (
                                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                                                <p className="font-medium mb-1">Provider Notes:</p>
                                                <p className="text-muted-foreground">{booking.providerNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem>
                                            {booking.status === 'disputed' && (
                                                <DropdownMenuItem onClick={() => setSelectedBooking(booking)}>
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    Resolve Dispute
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            {booking.status !== 'completed' && (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'completed')}>
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark as Completed
                                                </DropdownMenuItem>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(booking.id, 'cancelled')}>
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Cancel Booking
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                        {filteredBookings.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No bookings found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Dispute Resolution Modal */}
            {selectedBooking && selectedBooking.status === 'disputed' && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Resolve Dispute</CardTitle>
                            <CardDescription>
                                Booking: {selectedBooking.title}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-2">Resolution Notes</p>
                                <Textarea
                                    value={disputeResolution}
                                    onChange={(e) => setDisputeResolution(e.target.value)}
                                    placeholder="Enter resolution details..."
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedBooking(null)
                                        setDisputeResolution('')
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleResolveDispute(selectedBooking.id, disputeResolution)}
                                >
                                    Resolve Dispute
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default AdminBookingManagement

