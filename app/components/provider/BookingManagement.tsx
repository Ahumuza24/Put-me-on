import React, { useState, useEffect } from 'react'
import { 
    Calendar, 
    Clock, 
    DollarSign, 
    User, 
    MessageSquare, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    Filter,
    Search,
    MoreVertical,
    Eye,
    Send
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '~/components/ui/dropdown-menu'
import ProviderLayout from './ProviderLayout'
import UserAvatar from './UserAvatar'
import { useAuth } from '~/context/AuthContext'

interface BookingManagementProps {
    // No props needed - will use useAuth hook internally
}

interface Booking {
    id: number
    clientName: string
    clientEmail: string
    clientAvatar?: string
    serviceTitle: string
    serviceId: number
    status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled'
    amount: number
    startDate: string
    endDate: string
    description: string
    clientMessage?: string
    providerMessage?: string
    createdAt: string
    updatedAt: string
}

const BookingManagement: React.FC<BookingManagementProps> = () => {
    const { user, profile } = useAuth()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Mock data - in real app, this would come from API
    useEffect(() => {
        setBookings([
            {
                id: 1,
                clientName: 'Nakato Mbabazi',
                clientEmail: 'nakato.mbabazi@email.com',
                serviceTitle: 'Custom Website Development',
                serviceId: 1,
                status: 'in-progress',
                amount: 5700000,
                startDate: '2024-01-15',
                endDate: '2024-01-29',
                description: 'I need a modern website for my consulting business with a contact form and blog section.',
                clientMessage: 'Hi! I love the initial design concepts. When can we schedule a call to discuss the next steps?',
                providerMessage: 'Great! I can schedule a call for tomorrow at 2 PM. Does that work for you?',
                createdAt: '2024-01-10',
                updatedAt: '2024-01-15'
            },
            {
                id: 2,
                clientName: 'Kato Ssemwogerere',
                clientEmail: 'kato.ssemwogerere@email.com',
                serviceTitle: 'Logo Design Package',
                serviceId: 2,
                status: 'completed',
                amount: 1330000,
                startDate: '2024-01-05',
                endDate: '2024-01-12',
                description: 'I need a professional logo for my tech startup. Looking for something modern and minimalist.',
                clientMessage: 'The final logo looks perfect! Thank you so much.',
                providerMessage: 'You\'re welcome! It was a pleasure working with you.',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-12'
            },
            {
                id: 3,
                clientName: 'Namukasa Nalubega',
                clientEmail: 'namukasa.nalubega@email.com',
                serviceTitle: 'Brand Identity Package',
                serviceId: 3,
                status: 'pending',
                amount: 3040000,
                startDate: '2024-01-20',
                endDate: '2024-02-03',
                description: 'I need a complete brand identity including logo, business cards, and letterhead.',
                clientMessage: 'Hi! I\'m interested in your brand identity package. Can you tell me more about your process?',
                createdAt: '2024-01-18',
                updatedAt: '2024-01-18'
            },
            {
                id: 4,
                clientName: 'Mukasa Wasswa',
                clientEmail: 'mukasa.wasswa@email.com',
                serviceTitle: 'E-commerce Store Setup',
                serviceId: 4,
                status: 'cancelled',
                amount: 9500000,
                startDate: '2024-01-25',
                endDate: '2024-02-15',
                description: 'I need a complete e-commerce solution for my online store.',
                clientMessage: 'I\'ve decided to go with a different approach. Thanks for your time.',
                createdAt: '2024-01-20',
                updatedAt: '2024-01-22'
            }
        ])
    }, [])

    const handleStatusChange = async (bookingId: number, newStatus: string) => {
        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setBookings(prev => prev.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] }
                    : booking
            ))
        } catch (error) {
            console.error('Error updating booking status:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedBooking) return

        setLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setBookings(prev => prev.map(booking => 
                booking.id === selectedBooking.id 
                    ? { ...booking, providerMessage: message, updatedAt: new Date().toISOString().split('T')[0] }
                    : booking
            ))
            
            setMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            case 'accepted':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            case 'in-progress':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />
            case 'accepted':
                return <CheckCircle className="h-4 w-4" />
            case 'in-progress':
                return <AlertCircle className="h-4 w-4" />
            case 'completed':
                return <CheckCircle className="h-4 w-4" />
            case 'cancelled':
                return <XCircle className="h-4 w-4" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        inProgress: bookings.filter(b => b.status === 'in-progress').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        totalEarnings: bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + b.amount, 0)
    }

    const actions = <UserAvatar />

    return (
        <ProviderLayout
            title="My Bookings"
            description="Manage your client requests and bookings"
            actions={actions}
        >
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Bookings</p>
                                    <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                                </div>
                                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
                                </div>
                                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">In Progress</p>
                                    <p className="text-xl sm:text-2xl font-bold">{stats.inProgress}</p>
                                </div>
                                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Earnings</p>
                                    <p className="text-lg sm:text-2xl font-bold truncate">${stats.totalEarnings.toLocaleString()}</p>
                                </div>
                                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-10 sm:h-11"
                            />
                        </div>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-48 h-10 sm:h-11">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bookings List */}
                <div className="space-y-3 sm:space-y-4">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                        >
                            <Card>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3 sm:space-y-4 w-full">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base sm:text-lg font-semibold truncate">{booking.clientName}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{booking.clientEmail}</p>
                                                </div>
                                                <Badge className={getStatusColor(booking.status)}>
                                                    <div className="flex items-center space-x-1">
                                                        {getStatusIcon(booking.status)}
                                                        <span className="capitalize text-xs sm:text-sm">{booking.status.replace('-', ' ')}</span>
                                                    </div>
                                                </Badge>
                                            </div>

                                            <div>
                                                <h4 className="font-medium">{booking.serviceTitle}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">{booking.description}</p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="font-semibold truncate">UGX {booking.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">{booking.startDate} - {booking.endDate}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 sm:col-span-2 lg:col-span-1">
                                                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                    <span className="truncate">Created {booking.createdAt}</span>
                                                </div>
                                            </div>

                                            {booking.clientMessage && (
                                                <div className="bg-muted/50 p-4 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">Client Message:</p>
                                                    <p className="text-sm text-muted-foreground">{booking.clientMessage}</p>
                                                </div>
                                            )}

                                            {booking.providerMessage && (
                                                <div className="bg-primary/5 p-4 rounded-lg">
                                                    <p className="text-sm font-medium mb-1">Your Response:</p>
                                                    <p className="text-sm text-muted-foreground">{booking.providerMessage}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 w-full sm:w-auto sm:ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedBooking(booking)}
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Message
                                            </Button>
                                            
                                            {booking.status === 'pending' && (
                                                <div className="flex space-x-2 flex-1 sm:flex-none">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStatusChange(booking.id, 'accepted')}
                                                        disabled={loading}
                                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                        disabled={loading}
                                                        className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                    >
                                                        Decline
                                                    </Button>
                                                </div>
                                            )}

                                            {booking.status === 'accepted' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusChange(booking.id, 'in-progress')}
                                                    disabled={loading}
                                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                >
                                                    Start Work
                                                </Button>
                                            )}

                                            {booking.status === 'in-progress' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusChange(booking.id, 'completed')}
                                                    disabled={loading}
                                                    className="flex-1 sm:flex-none text-xs sm:text-sm"
                                                >
                                                    Mark Complete
                                                </Button>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="h-4 w-4 mr-2" />
                                                        Message Client
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {filteredBookings.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-muted-foreground mb-4">
                            {searchTerm || filterStatus !== 'all' 
                                ? 'No bookings match your search criteria'
                                : 'You don\'t have any bookings yet'
                            }
                        </div>
                    </div>
                )}

            {/* Message Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div
                        className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-2xl font-bold mb-4">Message {selectedBooking.clientName}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="message">Your Message</Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedBooking(null)
                                    setMessage('')
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendMessage}
                                disabled={loading || !message.trim()}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </ProviderLayout>
    )
}

export default BookingManagement
