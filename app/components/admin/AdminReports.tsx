import React, { useState, useEffect } from 'react'
import { 
    FileText, 
    Download,
    Calendar,
    Users,
    Briefcase,
    DollarSign,
    Filter,
    FileSpreadsheet
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { profileStorage, type UserProfile } from '~/lib/profile-storage'
import { servicesStorage, type Service } from '~/lib/services-storage'
import { bookingsStorage, type Booking } from '~/lib/bookings-storage'

interface ReportData {
    type: 'users' | 'services' | 'bookings' | 'earnings' | 'full'
    dateRange: string
    data: any[]
}

const AdminReports: React.FC = () => {
    const [reportType, setReportType] = useState<'users' | 'services' | 'bookings' | 'earnings' | 'full'>('full')
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d')
    const [generating, setGenerating] = useState(false)

    const generateReport = async () => {
        setGenerating(true)
        try {
            let reportData: ReportData = {
                type: reportType,
                dateRange,
                data: []
            }

            // Calculate date filter
            const now = new Date()
            const dateFilter = new Date()
            if (dateRange === '7d') dateFilter.setDate(now.getDate() - 7)
            else if (dateRange === '30d') dateFilter.setMonth(now.getMonth() - 1)
            else if (dateRange === '90d') dateFilter.setMonth(now.getMonth() - 3)
            else if (dateRange === '1y') dateFilter.setFullYear(now.getFullYear() - 1)

            if (reportType === 'users' || reportType === 'full') {
                const profiles = await profileStorage.getAll()
                const filteredProfiles = dateRange === 'all' 
                    ? profiles 
                    : profiles.filter(p => new Date(p.createdAt) >= dateFilter)
                
                reportData.data.push({
                    category: 'Users',
                    records: filteredProfiles.map(p => ({
                        id: p.id,
                        name: p.fullName,
                        email: p.email,
                        type: p.userType,
                        verified: p.verified,
                        location: p.location,
                        createdAt: p.createdAt
                    }))
                })
            }

            if (reportType === 'services' || reportType === 'full') {
                const services = await servicesStorage.getAll()
                const filteredServices = dateRange === 'all'
                    ? services
                    : services.filter(s => new Date(s.createdAt) >= dateFilter)
                
                reportData.data.push({
                    category: 'Services',
                    records: filteredServices.map(s => ({
                        id: s.id,
                        title: s.title,
                        category: s.categoryName,
                        price: s.price,
                        priceType: s.priceType,
                        active: s.isActive,
                        featured: s.featured,
                        createdAt: s.createdAt
                    }))
                })
            }

            if (reportType === 'bookings' || reportType === 'full') {
                const bookings = await bookingsStorage.getAll()
                const filteredBookings = dateRange === 'all'
                    ? bookings
                    : bookings.filter(b => new Date(b.createdAt) >= dateFilter)
                
                reportData.data.push({
                    category: 'Bookings',
                    records: filteredBookings.map(b => ({
                        id: b.id,
                        title: b.title,
                        client: b.client?.fullName,
                        provider: b.provider?.fullName,
                        service: b.service?.title,
                        status: b.status,
                        budget: b.budget,
                        createdAt: b.createdAt
                    }))
                })
            }

            if (reportType === 'earnings' || reportType === 'full') {
                const bookings = await bookingsStorage.getAll()
                const filteredBookings = dateRange === 'all'
                    ? bookings
                    : bookings.filter(b => new Date(b.createdAt) >= dateFilter)
                const completedBookings = filteredBookings.filter(b => b.status === 'completed')
                
                reportData.data.push({
                    category: 'Earnings',
                    records: completedBookings.map(b => ({
                        id: b.id,
                        bookingId: b.id,
                        amount: b.budget,
                        fees: b.budget * 0.10,
                        netAmount: b.budget * 0.90,
                        client: b.client?.fullName,
                        provider: b.provider?.fullName,
                        service: b.service?.title,
                        date: b.createdAt
                    }))
                })
            }

            exportToCSV(reportData)
        } catch (error) {
            console.error('Error generating report:', error)
        } finally {
            setGenerating(false)
        }
    }

    const exportToCSV = (reportData: ReportData) => {
        const csvRows: string[] = []
        
        reportData.data.forEach((category) => {
            csvRows.push(`\n=== ${category.category} ===\n`)
            
            if (category.records.length === 0) {
                csvRows.push('No records found\n')
                return
            }

            // Headers
            const headers = Object.keys(category.records[0])
            csvRows.push(headers.join(','))
            
            // Rows
            category.records.forEach((record: any) => {
                const values = headers.map(header => {
                    const value = record[header]
                    if (value === null || value === undefined) return ''
                    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
                    if (value instanceof Date) return new Date(value).toLocaleDateString()
                    return String(value).replace(/,/g, ';') // Replace commas to avoid CSV issues
                })
                csvRows.push(values.join(','))
            })
        })

        const csv = csvRows.join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `report-${reportType}-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const exportToJSON = async () => {
        setGenerating(true)
        try {
            const [profiles, services, bookings] = await Promise.all([
                profileStorage.getAll(),
                servicesStorage.getAll(),
                bookingsStorage.getAll()
            ])

            const report = {
                generatedAt: new Date().toISOString(),
                dateRange,
                reportType,
                data: {
                    users: profiles,
                    services: services,
                    bookings: bookings,
                    summary: {
                        totalUsers: profiles.length,
                        totalProviders: profiles.filter(p => p.userType === 'provider').length,
                        totalClients: profiles.filter(p => p.userType === 'client').length,
                        totalServices: services.length,
                        totalBookings: bookings.length,
                        completedBookings: bookings.filter(b => b.status === 'completed').length,
                        totalRevenue: bookings
                            .filter(b => b.status === 'completed')
                            .reduce((sum, b) => sum + b.budget, 0)
                    }
                }
            }

            const json = JSON.stringify(report, null, 2)
            const blob = new Blob([json], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `report-${reportType}-${dateRange}-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error exporting to JSON:', error)
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Reports & Export</h2>
                <p className="text-muted-foreground">
                    Generate and export comprehensive platform reports.
                </p>
            </div>

            {/* Report Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>Generate Report</CardTitle>
                    <CardDescription>Configure report type and date range</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Report Type</label>
                            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full">Full Platform Report</SelectItem>
                                    <SelectItem value="users">Users Report</SelectItem>
                                    <SelectItem value="services">Services Report</SelectItem>
                                    <SelectItem value="bookings">Bookings Report</SelectItem>
                                    <SelectItem value="earnings">Earnings Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Date Range</label>
                            <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                    <SelectItem value="1y">Last year</SelectItem>
                                    <SelectItem value="all">All time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Button 
                            onClick={generateReport} 
                            disabled={generating}
                            className="flex items-center space-x-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export to CSV</span>
                        </Button>
                        <Button 
                            onClick={exportToJSON} 
                            disabled={generating}
                            variant="outline"
                            className="flex items-center space-x-2"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Export to JSON</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Report Types Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Users Report</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Export all user data including profiles, verification status, and registration dates.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                            <Briefcase className="h-4 w-4" />
                            <span>Services Report</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Export all services with details including categories, pricing, and status.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Bookings Report</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Export all bookings with client/provider information and status details.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Earnings Report</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Export financial data including revenue, fees, and transaction details.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Statistics</CardTitle>
                    <CardDescription>Overview of data that will be included in the report</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {reportType === 'users' || reportType === 'full' ? '✓' : '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {reportType === 'services' || reportType === 'full' ? '✓' : '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">Services</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {reportType === 'bookings' || reportType === 'full' ? '✓' : '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">Bookings</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {reportType === 'earnings' || reportType === 'full' ? '✓' : '—'}
                            </div>
                            <div className="text-sm text-muted-foreground">Earnings</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminReports

