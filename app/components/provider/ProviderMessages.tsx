import React, { useState, useEffect } from 'react'
import {
    Search,
    Filter,
    MessageSquare,
    Send,
    Clock,
    User,
    Mail,
    Phone,
    MapPin,
    Star,
    MoreVertical,
    Archive,
    Trash2,
    Reply,
    CheckCircle,
    AlertCircle
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

interface ProviderMessagesProps {
    // No props needed - will use useAuth hook internally
}

interface Message {
    id: string
    clientId: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    clientLocation?: string
    subject: string
    message: string
    timestamp: string
    isRead: boolean
    isArchived: boolean
    priority: 'low' | 'medium' | 'high'
    relatedService?: string
    relatedBooking?: string
    attachments?: string[]
}

interface Conversation {
    id: string
    clientId: string
    clientName: string
    clientEmail: string
    clientAvatar?: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    isArchived: boolean
    priority: 'low' | 'medium' | 'high'
    relatedService?: string
}

const ProviderMessages: React.FC<ProviderMessagesProps> = () => {
    const { user, profile } = useAuth()
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPriority, setFilterPriority] = useState('all')
    const [isLoading, setIsLoading] = useState(false)

    // Mock data - replace with actual API calls
    useEffect(() => {
        setConversations([
            {
                id: '1',
                clientId: 'client1',
                clientName: 'Nakato Mbabazi',
                clientEmail: 'nakato.mbabazi@email.com',
                clientAvatar: '/avatars/nakato.jpg',
                lastMessage: 'Thank you for the quick response! I\'m excited to work with you.',
                lastMessageTime: '2 minutes ago',
                unreadCount: 2,
                isArchived: false,
                priority: 'high',
                relatedService: 'Website Development'
            },
            {
                id: '2',
                clientId: 'client2',
                clientName: 'Kato Ssemwogerere',
                clientEmail: 'kato.ssemwogerere@email.com',
                lastMessage: 'Could you please send me the project timeline?',
                lastMessageTime: '1 hour ago',
                unreadCount: 0,
                isArchived: false,
                priority: 'medium',
                relatedService: 'Mobile App Development'
            },
            {
                id: '3',
                clientId: 'client3',
                clientName: 'Namukasa Nalubega',
                clientEmail: 'namukasa.nalubega@email.com',
                lastMessage: 'The design looks amazing! When can we schedule the next review?',
                lastMessageTime: '3 hours ago',
                unreadCount: 1,
                isArchived: false,
                priority: 'low',
                relatedService: 'UI/UX Design'
            },
            {
                id: '4',
                clientId: 'client4',
                clientName: 'Mukasa Wasswa',
                clientEmail: 'mukasa.wasswa@email.com',
                lastMessage: 'I have some questions about the pricing structure.',
                lastMessageTime: '1 day ago',
                unreadCount: 0,
                isArchived: true,
                priority: 'medium',
                relatedService: 'Consulting'
            }
        ])

        setMessages([
            {
                id: 'msg1',
                clientId: 'client1',
                clientName: 'Nakato Mbabazi',
                clientEmail: 'nakato.mbabazi@email.com',
                clientPhone: '+256 700 123 456',
                clientLocation: 'Kampala, Uganda',
                subject: 'Website Development Project',
                message: 'Hi! I\'m interested in hiring you for a website development project. I saw your portfolio and I\'m impressed with your work. Could we schedule a call to discuss the details?',
                timestamp: '2024-01-15T10:30:00Z',
                isRead: true,
                isArchived: false,
                priority: 'high',
                relatedService: 'Website Development',
                relatedBooking: 'booking1'
            },
            {
                id: 'msg2',
                clientId: 'client1',
                clientName: 'Nakato Mbabazi',
                clientEmail: 'nakato.mbabazi@email.com',
                subject: 'Re: Website Development Project',
                message: 'Thank you for the quick response! I\'m excited to work with you. I\'ve attached the project requirements document. Please let me know if you need any clarification.',
                timestamp: '2024-01-15T11:45:00Z',
                isRead: true,
                isArchived: false,
                priority: 'high',
                relatedService: 'Website Development',
                relatedBooking: 'booking1',
                attachments: ['requirements.pdf']
            },
            {
                id: 'msg3',
                clientId: 'client1',
                clientName: 'Nakato Mbabazi',
                clientEmail: 'nakato.mbabazi@email.com',
                subject: 'Re: Website Development Project',
                message: 'Perfect! I\'ve reviewed the requirements and I\'m confident I can deliver exactly what you need. I\'ll send over the project proposal and timeline by tomorrow.',
                timestamp: '2024-01-15T14:20:00Z',
                isRead: false,
                isArchived: false,
                priority: 'high',
                relatedService: 'Website Development',
                relatedBooking: 'booking1'
            }
        ])
    }, [])

    const filteredConversations = conversations.filter(conversation => {
        const matchesSearch = conversation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            conversation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'unread' && conversation.unreadCount > 0) ||
                            (filterStatus === 'archived' && conversation.isArchived)
        
        const matchesPriority = filterPriority === 'all' || conversation.priority === filterPriority
        
        return matchesSearch && matchesStatus && matchesPriority
    })

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return

        setIsLoading(true)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newMsg: Message = {
            id: `msg_${Date.now()}`,
            clientId: selectedConversation.clientId,
            clientName: selectedConversation.clientName,
            clientEmail: selectedConversation.clientEmail,
            subject: `Re: ${selectedConversation.relatedService || 'Message'}`,
            message: newMessage,
            timestamp: new Date().toISOString(),
            isRead: true,
            isArchived: false,
            priority: selectedConversation.priority
        }

        setMessages(prev => [...prev, newMsg])
        setNewMessage('')
        setIsLoading(false)
    }

    const handleArchiveConversation = (conversationId: string) => {
        setConversations(prev => 
            prev.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, isArchived: !conv.isArchived }
                    : conv
            )
        )
    }

    const handleDeleteConversation = (conversationId: string) => {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        if (selectedConversation?.id === conversationId) {
            setSelectedConversation(null)
            setMessages([])
        }
    }

    const actions = <UserAvatar />

    return (
        <ProviderLayout
            title="Messages"
            description="Communicate with your clients"
            actions={actions}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Conversations List */}
                <div className="lg:col-span-1 flex flex-col">
                    <Card className="flex-1">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Conversations</CardTitle>
                                <Badge variant="secondary">
                                    {conversations.filter(c => !c.isArchived).length} Active
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Search and Filters */}
                            <div className="p-4 border-b space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search conversations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="unread">Unread</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priority</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Conversations */}
                            <div className="max-h-96 overflow-y-auto">
                                {filteredConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`p-4 border-b cursor-pointer transition-colors ${
                                            selectedConversation?.id === conversation.id 
                                                ? 'bg-primary/10 border-primary' 
                                                : 'hover:bg-muted/50'
                                        }`}
                                        onClick={() => setSelectedConversation(conversation)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium truncate">
                                                        {conversation.clientName}
                                                    </h4>
                                                    {conversation.unreadCount > 0 && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            {conversation.unreadCount}
                                                        </Badge>
                                                    )}
                                                    <Badge 
                                                        variant={
                                                            conversation.priority === 'high' ? 'destructive' :
                                                            conversation.priority === 'medium' ? 'default' : 'secondary'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {conversation.priority}
                                                    </Badge>
                                                </div>
                                                
                                                <p className="text-sm text-muted-foreground truncate mb-1">
                                                    {conversation.lastMessage}
                                                </p>
                                                
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>{conversation.lastMessageTime}</span>
                                                    {conversation.relatedService && (
                                                        <span className="truncate max-w-24">
                                                            {conversation.relatedService}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleArchiveConversation(conversation.id)}>
                                                        <Archive className="h-4 w-4 mr-2" />
                                                        {conversation.isArchived ? 'Unarchive' : 'Archive'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDeleteConversation(conversation.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Messages */}
                <div className="lg:col-span-2 flex flex-col">
                    {selectedConversation ? (
                        <Card className="flex-1 flex flex-col">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            {selectedConversation.clientName}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {selectedConversation.clientEmail}
                                            </span>
                                            {selectedConversation.relatedService && (
                                                <Badge variant="outline">
                                                    {selectedConversation.relatedService}
                                                </Badge>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <Badge 
                                        variant={
                                            selectedConversation.priority === 'high' ? 'destructive' :
                                            selectedConversation.priority === 'medium' ? 'default' : 'secondary'
                                        }
                                    >
                                        {selectedConversation.priority} Priority
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="flex-1 p-0">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {messages
                                        .filter(msg => msg.clientId === selectedConversation.clientId)
                                        .map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.clientId === selectedConversation.clientId ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.clientId === selectedConversation.clientId
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                }`}>
                                                    <p className="text-sm">{message.message}</p>
                                                    <p className={`text-xs mt-1 ${
                                                        message.clientId === selectedConversation.clientId
                                                            ? 'text-primary-foreground/70'
                                                            : 'text-muted-foreground'
                                                    }`}>
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Message Input */}
                                <div className="border-t p-4">
                                    <div className="flex gap-2">
                                        <Textarea
                                            placeholder="Type your message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="min-h-[60px] resize-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleSendMessage()
                                                }
                                            }}
                                        />
                                        <Button 
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || isLoading}
                                            size="sm"
                                        >
                                            {isLoading ? (
                                                <Clock className="h-4 w-4" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
                                <p className="text-muted-foreground">
                                    Choose a conversation from the list to start messaging
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </ProviderLayout>
    )
}

export default ProviderMessages
