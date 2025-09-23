import React, { useState, useEffect } from 'react'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    Download,
    Filter,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    CreditCard,
    Banknote,
    Wallet,
    Target,
    BarChart3,
    RefreshCw
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Progress } from '~/components/ui/progress'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import ProviderLayout from './ProviderLayout'
import UserAvatar from './UserAvatar'
import { useAuth } from '~/context/AuthContext'

interface ProviderEarningsProps {
    // No props needed - will use useAuth hook internally
}

interface EarningsData {
    summary: {
        totalEarnings: number
        thisMonth: number
        lastMonth: number
        growth: number
        pendingAmount: number
        availableBalance: number
        nextPayout: string
    }
    transactions: Array<{
        id: string
        type: 'payment' | 'refund' | 'withdrawal' | 'bonus'
        amount: number
        status: 'completed' | 'pending' | 'failed' | 'processing'
        description: string
        clientName: string
        serviceName: string
        date: string
        paymentMethod: string
        fees: number
        netAmount: number
    }>
    monthlyBreakdown: Array<{
        month: string
        earnings: number
        transactions: number
        averageTransaction: number
    }>
    goals: {
        monthlyTarget: number
        currentProgress: number
        daysRemaining: number
        projectedEarnings: number
    }
}

const ProviderEarnings: React.FC<ProviderEarningsProps> = () => {
    const { user, profile } = useAuth()
    const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
    const [timeRange, setTimeRange] = useState('30d')
    const [filterStatus, setFilterStatus] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Mock data - replace with actual API calls
    useEffect(() => {
        const loadEarningsData = async () => {
            setIsLoading(true)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setEarningsData({
                summary: {
                    totalEarnings: 173280000,
                    thisMonth: 33250000,
                    lastMonth: 27360000,
                    growth: 21.5,
                    pendingAmount: 4750000,
                    availableBalance: 13300000,
                    nextPayout: '2024-01-20'
                },
                transactions: [
                    {
                        id: 'txn_001',
                        type: 'payment',
                        amount: 9500000,
                        status: 'completed',
                        description: 'Website Development Project',
                        clientName: 'Nakato Mbabazi',
                        serviceName: 'Website Development',
                        date: '2024-01-15T10:30:00Z',
                        paymentMethod: 'Bank Transfer',
                        fees: 285000,
                        netAmount: 9215000
                    },
                    {
                        id: 'txn_002',
                        type: 'payment',
                        amount: 6840000,
                        status: 'completed',
                        description: 'Mobile App UI Design',
                        clientName: 'Kato Ssemwogerere',
                        serviceName: 'UI/UX Design',
                        date: '2024-01-14T14:20:00Z',
                        paymentMethod: 'Mobile Money',
                        fees: 205200,
                        netAmount: 6634800
                    },
                    {
                        id: 'txn_003',
                        type: 'payment',
                        amount: 12160000,
                        status: 'pending',
                        description: 'E-commerce Platform Development',
                        clientName: 'Namukasa Nalubega',
                        serviceName: 'Website Development',
                        date: '2024-01-13T09:15:00Z',
                        paymentMethod: 'Bank Transfer',
                        fees: 364800,
                        netAmount: 11795200
                    },
                    {
                        id: 'txn_004',
                        type: 'payment',
                        amount: 3610000,
                        status: 'completed',
                        description: 'Consulting Session',
                        clientName: 'Mukasa Wasswa',
                        serviceName: 'Consulting',
                        date: '2024-01-12T16:45:00Z',
                        paymentMethod: 'Mobile Money',
                        fees: 108300,
                        netAmount: 3501700
                    },
                    {
                        id: 'txn_005',
                        type: 'refund',
                        amount: -1900000,
                        status: 'completed',
                        description: 'Partial refund - Logo Design',
                        clientName: 'Nalubega Nakamya',
                        serviceName: 'Graphic Design',
                        date: '2024-01-11T11:30:00Z',
                        paymentMethod: 'Bank Transfer',
                        fees: 0,
                        netAmount: -1900000
                    },
                    {
                        id: 'txn_006',
                        type: 'withdrawal',
                        amount: -7600000,
                        status: 'completed',
                        description: 'Withdrawal to bank account',
                        clientName: 'Self',
                        serviceName: 'Withdrawal',
                        date: '2024-01-10T08:00:00Z',
                        paymentMethod: 'Bank Transfer',
                        fees: 0,
                        netAmount: -7600000
                    },
                    {
                        id: 'txn_007',
                        type: 'bonus',
                        amount: 760000,
                        status: 'completed',
                        description: 'Referral bonus',
                        clientName: 'System',
                        serviceName: 'Referral',
                        date: '2024-01-09T12:00:00Z',
                        paymentMethod: 'Platform Credit',
                        fees: 0,
                        netAmount: 760000
                    }
                ],
                monthlyBreakdown: [
                    { month: 'Jan 2024', earnings: 33250000, transactions: 12, averageTransaction: 2770833 },
                    { month: 'Dec 2023', earnings: 27360000, transactions: 10, averageTransaction: 2736000 },
                    { month: 'Nov 2023', earnings: 25840000, transactions: 9, averageTransaction: 2871111 },
                    { month: 'Oct 2023', earnings: 31160000, transactions: 11, averageTransaction: 2827273 },
                    { month: 'Sep 2023', earnings: 22420000, transactions: 8, averageTransaction: 2802500 },
                    { month: 'Aug 2023', earnings: 26980000, transactions: 10, averageTransaction: 2698000 }
                ],
                goals: {
                    monthlyTarget: 38000000,
                    currentProgress: 87.5,
                    daysRemaining: 8,
                    projectedEarnings: 47500000
                }
            })
            
            setIsLoading(false)
        }

        loadEarningsData()
    }, [timeRange])

    const filteredTransactions = earningsData?.transactions.filter(transaction => {
        const matchesSearch = transaction.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
        
        return matchesSearch && matchesStatus
    }) || []

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-600" />
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-600" />
            case 'processing':
                return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        const variants = {
            completed: 'default',
            pending: 'secondary',
            failed: 'destructive',
            processing: 'outline'
        } as const

        return (
            <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const actions = (
        <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
            <UserAvatar />
        </div>
    )

    if (isLoading) {
        return (
            <ProviderLayout
                title="Earnings"
                description="Track your payments and revenue"
                actions={actions}
            >
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading earnings data...</p>
                    </div>
                </div>
            </ProviderLayout>
        )
    }

    if (!earningsData) {
        return (
            <ProviderLayout
                title="Earnings"
                description="Track your payments and revenue"
                actions={actions}
            >
                <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No earnings data available</h3>
                    <p className="text-muted-foreground">
                        Start completing projects to see your earnings here
                    </p>
                </div>
            </ProviderLayout>
        )
    }

    return (
        <ProviderLayout
            title="Earnings"
            description="Track your payments and revenue"
            actions={actions}
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                                    <p className="text-2xl font-bold">{formatCurrency(earningsData.summary.totalEarnings)}</p>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +{earningsData.summary.growth}% this month
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                                    <p className="text-2xl font-bold">{formatCurrency(earningsData.summary.thisMonth)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        vs {formatCurrency(earningsData.summary.lastMonth)} last month
                                    </p>
                                </div>
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                                    <p className="text-2xl font-bold">{formatCurrency(earningsData.summary.availableBalance)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Ready for withdrawal
                                    </p>
                                </div>
                                <Wallet className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold">{formatCurrency(earningsData.summary.pendingAmount)}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Next payout: {new Date(earningsData.summary.nextPayout).toLocaleDateString()}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Monthly Goal Progress */}
            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Monthly Goal Progress
                        </CardTitle>
                        <CardDescription>
                            Track your progress towards your monthly earnings target
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Monthly Target</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatCurrency(earningsData.goals.monthlyTarget)}
                                </span>
                            </div>
                            <Progress value={earningsData.goals.currentProgress} className="h-3" />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {earningsData.goals.currentProgress}% complete
                                </span>
                                <span className="font-medium">
                                    {earningsData.goals.daysRemaining} days remaining
                                </span>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Projected earnings</span>
                                    <span className="text-lg font-semibold text-green-600">
                                        {formatCurrency(earningsData.goals.projectedEarnings)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions */}
            <div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Transaction History</CardTitle>
                                <CardDescription>
                                    All your earnings, payments, and withdrawals
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search transactions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-64"
                                    />
                                </div>
                                <Select value={filterStatus} onValueChange={setFilterStatus}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Net Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">
                                            {formatDate(transaction.date)}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{transaction.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {transaction.serviceName}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{transaction.clientName}</TableCell>
                                        <TableCell>
                                            <span className={`font-medium ${
                                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(transaction.status)}
                                                {getStatusBadge(transaction.status)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {transaction.paymentMethod === 'Bank Transfer' && <Banknote className="h-4 w-4" />}
                                                {transaction.paymentMethod === 'PayPal' && <CreditCard className="h-4 w-4" />}
                                                {transaction.paymentMethod === 'Stripe' && <CreditCard className="h-4 w-4" />}
                                                {transaction.paymentMethod === 'Platform Credit' && <Wallet className="h-4 w-4" />}
                                                <span className="text-sm">{transaction.paymentMethod}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-medium ${
                                                transaction.netAmount > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {transaction.netAmount > 0 ? '+' : ''}{formatCurrency(transaction.netAmount)}
                                            </span>
                                            {transaction.fees > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Fees: {formatCurrency(transaction.fees)}
                                                </p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ProviderLayout>
    )
}

export default ProviderEarnings
