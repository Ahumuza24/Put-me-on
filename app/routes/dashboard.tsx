import { useAuth } from '~/context/AuthContext';
import { Button } from '~/components/ui/button';
import { Link } from '@remix-run/react';
import { 
    User, 
    Briefcase, 
    Calendar, 
    Settings, 
    LogOut,
    ArrowRight,
    Star,
    DollarSign,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function Dashboard() {
    const { user, profile, signOut } = useAuth();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (!error) {
            // Use window.location for a hard redirect to bypass route guards
            // This ensures we get to the landing page without ProtectedRoute interfering
            window.location.href = '/';
        }
    };

    // Get user type from profile or default to provider
    const userType = profile?.userType || 'provider';

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground">
                                Welcome back, {profile?.fullName || user?.email}
                                {profile?.location && ` from ${profile.location}`}
                            </p>
                        </div>
                        <Button onClick={handleSignOut} variant="outline">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Type Selection */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Choose Your Role</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                        >
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle>I'm a Client</CardTitle>
                                            <CardDescription>Looking to hire services</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Find and hire top local service providers for your projects.
                                    </p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link to="/client-dashboard">
                                            Browse Services
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div
                        >
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-primary">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Briefcase className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle>I'm a Provider</CardTitle>
                                            <CardDescription>Offering my services</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Create your profile and start earning from your expertise.
                                    </p>
                                    <Button className="w-full" asChild>
                                        <Link to="/provider/dashboard">
                                            Provider Dashboard
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                                    <p className="text-2xl font-bold capitalize">{userType}</p>
                                </div>
                                <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                                    <p className="text-2xl font-bold">
                                        {user?.created_at && new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <Calendar className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                                    <p className="text-2xl font-bold text-green-600">Active</p>
                                </div>
                                <Settings className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your account details and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <p className="text-sm">{profile?.fullName || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                    <p className="text-sm">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                    <p className="text-sm">{profile?.phone || 'Not set'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                                    <p className="text-sm">{profile?.location || 'Not set'}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">User Type</label>
                                    <p className="text-sm capitalize">{profile?.userType || 'Not set'}</p>
                                </div>
                                {profile?.serviceCategory && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Service Category</label>
                                        <p className="text-sm capitalize">{profile.serviceCategory.replace('-', ' ')}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                                    <p className="text-sm">{user?.created_at && new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                                    <p className="text-sm">Just now</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}