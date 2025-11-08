import React, { useState } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { supabase } from '~/lib/supabase.client';
import { profileStorage } from '~/lib/profile-storage';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [searchParams] = useSearchParams();
    const redirectParam = searchParams.get('redirect');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
            } else if (data.user) {
                // Login successful - check user profile and redirect based on role or redirect parameter
                try {
                    const profile = await profileStorage.getByUserId(data.user.id);
                    
                    // Determine redirect path
                    let redirectPath = '/services'; // Default for clients
                    
                    // If there's a redirect parameter, use it (unless user is admin/provider who should go to their dashboard)
                    if (redirectParam) {
                        const decodedRedirect = decodeURIComponent(redirectParam);
                        // Only use redirect param for clients, or if it's a valid admin/provider route
                        if (profile) {
                            if (profile.userType === 'admin' || profile.userType === 'super_admin') {
                                // Admins always go to admin dashboard, ignore redirect param
                                redirectPath = '/admin/dashboard';
                            } else if (profile.userType === 'provider') {
                                // Providers always go to provider dashboard, ignore redirect param
                                redirectPath = '/provider/dashboard';
                            } else {
                                // Clients can use the redirect parameter
                                redirectPath = decodedRedirect;
                            }
                        } else {
                            // No profile yet, use redirect param
                            redirectPath = decodedRedirect;
                        }
                    } else if (profile) {
                        // No redirect param, use default based on user type
                        if (profile.userType === 'admin' || profile.userType === 'super_admin') {
                            redirectPath = '/admin/dashboard';
                        } else if (profile.userType === 'provider') {
                            redirectPath = '/provider/dashboard';
                        }
                    }
                    
                    // Use setTimeout to allow React to complete the current render cycle
                    // Then use window.location for a hard redirect to avoid DOM conflicts
                    setTimeout(() => {
                        window.location.href = redirectPath;
                    }, 100);
                } catch (profileError) {
                    console.error('Error loading profile:', profileError);
                    // Fallback: use redirect param if available, otherwise services page
                    const fallbackPath = redirectParam ? decodeURIComponent(redirectParam) : '/services';
                    setTimeout(() => {
                        window.location.href = fallbackPath;
                    }, 100);
                }
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-xl sm:rounded-2xl p-6 sm:p-8 mx-4'>
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">Sign in to your account</p>
                </div>

                {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}
                
                <div className='space-y-4'>
                    <div className='relative'>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                id="email"
                                type="email"
                                placeholder='Enter your email'
                                required
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>
                        
                    <div className='relative'>
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative mt-1">
                            <Input
                                id="password"
                                type="password"
                                placeholder='Enter your password'
                                required
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="rounded border-border"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                        />
                        <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-primary hover:text-primary/80 font-medium">
                        Forgot Password?
                    </Link>
                </div>
                
                <Button 
                    type="submit" 
                    className="w-full h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg"
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                            Create Account
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;