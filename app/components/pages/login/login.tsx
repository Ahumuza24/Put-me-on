import React from 'react';
import { Link } from '@remix-run/react';
import { User, Lock } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const LoginForm: React.FC = () => {
    return (
        <div className='w-full max-w-md bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl p-8'>
            <form className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>
                
                <div className='space-y-4'>
                    <div className='relative'>
                        <Label htmlFor="username" className="text-sm font-medium">
                            Username or Email
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="username"
                                type="text" 
                                placeholder='Enter your username or email' 
                                required 
                                className="pl-10"
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
                            />
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-primary hover:text-primary/80 font-medium">
                        Forgot Password?
                    </Link>
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                    Sign In
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