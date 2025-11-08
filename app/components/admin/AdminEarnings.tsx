import React, { useState, useEffect } from 'react'
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown,
    Calendar,
    Download,
    Filter,
    ArrowUp,
    ArrowDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { bookingsStorage, type Booking } from '~/lib/bookings-storage'
import { StatsCardSkeleton, Skeleton } from '~/components/ui/skeletons'

interface EarningsData {
    totalRevenue: number
    platformFees: number
    netRevenue: number
    thisMonth: number
    lastMonth: number
    growth: number
    completedBookings: number
    pendingPayments: number
    averageTransaction: number
    monthlyBreakdown: Array<{
        month: string
        revenue: number
        fees: number
        bookings: number
    }>
    transactions: Array<{
        id: string
        bookingId: string
        amount: number
        fees: number
        netAmount: number
        status: 'completed' | 'pending' | 'refunded'
        date: string
        client: string
        provider: string
        service: string
    }>
}

const AdminEarnings: React.FC = () => {
    const [earnings, setEarnings] = useState<EarningsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all')

    useEffect(() => {
        loadEarningsData()
    }, [timeRange, filterStatus])

    const loadEarningsData = async () => {
        setLoading(true)
        try {
            const bookings = await bookingsStorage.getAll()
            
            // Calculate date range
            const now = new Date()
            const dateFilter = new Date()
            if (timeRange === '7d') dateFilter.setDate(now.getDate() - 7)
            else if (timeRange === '30d') dateFilter.setMonth(now.getMonth() - 1)
            else if (timeRange === '90d') dateFilter.setMonth(now.getMonth() - 3)
            
            const filteredBookings = timeRange === 'all' 
                ? bookings 
                : bookings.filter(b => new Date(b.createdAt) >= dateFilter)

            // Calculate revenue (platform takes 10% fee)
            const platformFeeRate = 0.10
            const completedBookings = filteredBookings.filter(b => b.status === 'completed')
            const totalRevenue = completedBookings.reduce((sum, b) => sum + b.budget, 0)
            const platformFees = totalRevenue * platformFeeRate
            const netRevenue = totalRevenue - platformFees

            // This month revenue
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            const thisMonthBookings = completedBookings.filter(b => 
                new Date(b.createdAt) >= thisMonthStart
            )
            const thisMonth = thisMonthBookings.reduce((sum, b) => sum + b.budget, 0)

            // Last month revenue
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
            const lastMonthBookings = completedBookings.filter(b => {
                const date = new Date(b.createdAt)
                return date >= lastMonthStart && date <= lastMonthEnd
            })
            const lastMonth = lastMonthBookings.reduce((sum, b) => sum + b.budget, 0)

            // Growth calculation
            const growth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0

            // Pending payments (bookings in progress)
            const pendingBookings = filteredBookings.filter(b => 
                ['accepted', 'in_progress'].includes(b.status)
            )
            const pendingPayments = pendingBookings.reduce((sum, b) => sum + b.budget, 0)

            // Average transaction
            const averageTransaction = completedBookings.length > 0 
                ? totalRevenue / completedBookings.length 
                : 0

            // Monthly breakdown (last 6 months)
            const monthlyBreakdown: Array<{ month: string; revenue: number; fees: number; bookings: number }> = []
            for (let i = 5; i >= 0; i--) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
                const monthBookings = completedBookings.filter(b => {
                    const date = new Date(b.createdAt)
                    return date >= monthStart && date <= monthEnd
                })
                const monthRevenue = monthBookings.reduce((sum, b) => sum + b.budget, 0)
                monthlyBreakdown.push({
                    month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    revenue: monthRevenue,
                    fees: monthRevenue * platformFeeRate,
                    bookings: monthBookings.length
                })
            }

            // Transactions
            const transactions = completedBookings.map(b => ({
                id: b.id,
                bookingId: b.id,
                amount: b.budget,
                fees: b.budget * platformFeeRate,
                netAmount: b.budget * (1 - platformFeeRate),
                status: 'completed' as const,
                date: b.createdAt,
                client: b.client?.fullName || 'Unknown',
                provider: b.provider?.fullName || 'Unknown',
                service: b.service?.title || 'Unknown'
            }))

            setEarnings({
                totalRevenue,
                platformFees,
                netRevenue,
                thisMonth,
                lastMonth,
                growth,
                completedBookings: completedBookings.length,
                pendingPayments,
                averageTransaction,
                monthlyBreakdown,
                transactions: filterStatus === 'all' 
                    ? transactions 
                    : transactions.filter(t => t.status === filterStatus)
            })
        } catch (error) {
            console.error('Error loading earnings data:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'UGX',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const exportToCSV = () => {
        if (!earnings) return

        const headers = ['Date', 'Booking ID', 'Amount', 'Fees', 'Net Amount', 'Client', 'Provider', 'Service', 'Status']
        const rows = earnings.transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.bookingId,
            t.amount.toString(),
            t.fees.toString(),
            t.netAmount.toString(),
            t.client,
            t.provider,
            t.service,
            t.status
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `earnings-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <StatsCardSkeleton key={i} />
                    ))}
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!earnings) {
        return <div>No earnings data available</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Earnings & Revenue</h2>
                    <p className="text-muted-foreground">
                        Track platform revenue, fees, and financial insights.
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="all">All time</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={exportToCSV} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(earnings.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {earnings.completedBookings} completed bookings
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{formatCurrency(earnings.platformFees)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            10% commission rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(earnings.thisMonth)}</div>
                        <div className="flex items-center mt-1">
                            {earnings.growth >= 0 ? (
                                <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                            ) : (
                                <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                            )}
                            <span className={`text-xs ${earnings.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(earnings.growth).toFixed(1)}% vs last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {formatCurrency(earnings.pendingPayments)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            In progress bookings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Breakdown Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Revenue Breakdown</CardTitle>
                    <CardDescription>Revenue and fees over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {earnings.monthlyBreakdown.map((month, index) => {
                            const maxRevenue = Math.max(...earnings.monthlyBreakdown.map(m => m.revenue))
                            const revenuePercentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
                            const feesPercentage = maxRevenue > 0 ? (month.fees / maxRevenue) * 100 : 0

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{month.month}</span>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-muted-foreground">
                                                Revenue: {formatCurrency(month.revenue)}
                                            </span>
                                            <span className="text-primary">
                                                Fees: {formatCurrency(month.fees)}
                                            </span>
                                            <Badge variant="secondary">{month.bookings} bookings</Badge>
                                        </div>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-8 relative overflow-hidden">
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-primary/20"
                                            style={{ width: `${revenuePercentage}%` }}
                                        />
                                        <div 
                                            className="absolute left-0 top-0 h-full bg-primary"
                                            style={{ width: `${feesPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>All completed booking transactions</CardDescription>
                        </div>
                        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {earnings.transactions.length > 0 ? (
                            earnings.transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <p className="font-medium">{transaction.service}</p>
                                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                                                {transaction.status}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            <span>{transaction.client} → {transaction.provider}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Fee: {formatCurrency(transaction.fees)} • Net: {formatCurrency(transaction.netAmount)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No transactions found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminEarnings

