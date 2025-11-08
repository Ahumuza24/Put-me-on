import { Skeleton } from "~/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "~/components/ui/card"

// Service Card Skeleton
export function ServiceCardSkeleton() {
    return (
        <Card className="h-full flex flex-col">
            <Skeleton className="w-full h-48" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                </div>
                <div className="mt-auto flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </CardContent>
        </Card>
    )
}

// Service List Skeleton
export function ServiceListSkeleton() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <Skeleton className="w-32 h-32 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                    <div className="text-right">
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    )
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                </td>
            ))}
        </tr>
    )
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
    return (
        <div className="rounded-md border">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-4 py-3 text-left">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, i) => (
                        <TableRowSkeleton key={i} columns={columns} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Dashboard Skeleton
export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatsCardSkeleton key={i} />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// User Card Skeleton
export function UserCardSkeleton() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    )
}

// Booking Card Skeleton
export function BookingCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    )
}

// Form Skeleton
export function FormSkeleton({ fields = 5 }: { fields?: number }) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: fields }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
                <div className="flex gap-2 pt-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    )
}

// Page Skeleton (for full page loading)
export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
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
                        <div className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

