import React, { useState } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { supabase } from '~/lib/supabase.client';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

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
            } else {
                // Login successful - redirect to dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl p-8'>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
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
                                className="pl-10"
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
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
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
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
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