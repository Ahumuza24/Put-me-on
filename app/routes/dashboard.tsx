import { useAuth } from '~/context/AuthContext';
import { Button } from '~/components/ui/button';
import { useNavigate } from '@remix-run/react';

export default function Dashboard() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
                    </div>
                    <Button onClick={handleSignOut} variant="outline">
                        Sign Out
                    </Button>
                </div>
                
                <div className="grid gap-6">
                    <div className="bg-card border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">User Information</h2>
                        <div className="space-y-2">
                            <p><strong>Email:</strong> {user?.email}</p>
                            <p><strong>User ID:</strong> {user?.id}</p>
                            <p><strong>Created:</strong> {user?.created_at && new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}