import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { User, Mail, Lock, Phone, MapPin, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { useAuth } from '~/context/AuthContext';
import { profileStorage } from '~/lib/profile-storage';
import { supabase } from '~/lib/supabase.client';

const SignupForm: React.FC = () => {
    const [userType, setUserType] = useState<'client' | 'provider'>('client');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { signUp, refreshProfile } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (!termsAccepted) {
            setError('Please accept the terms and conditions');
            setLoading(false);
            return;
        }

        if (userType === 'provider' && !category) {
            setError('Please select a service category');
            setLoading(false);
            return;
        }

        try {
            console.log('Starting signup process...')
            const { data: signUpData, error: signUpError } = await signUp(email, password);

            if (signUpError) {
                console.error('Signup error:', signUpError)
                setError(signUpError.message);
            } else {
                console.log('Signup successful:', signUpData)
                setSuccess('Account created successfully! Check your email for confirmation.');
                
                // Store user profile data
                if (signUpData?.user) {
                    try {
                        console.log('Creating profile for user:', signUpData.user.id, 'with data:', {
                            fullName,
                            email,
                            phone,
                            location,
                            userType,
                            serviceCategory: userType === 'provider' ? category : undefined
                        });
                        
                        // Wait for user session to be established
                        console.log('Waiting for user session to be established...');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        // Check if user is authenticated
                        const { data: { user: authUser } } = await supabase.auth.getUser();
                        console.log('Current authenticated user:', authUser?.id);
                        
                        if (!authUser) {
                            throw new Error('User not authenticated after signup');
                        }
                        
                        if (authUser.id !== signUpData.user.id) {
                            throw new Error('User ID mismatch after signup');
                        }
                        
                        console.log('User is properly authenticated, creating profile...');
                        
                        const createdProfile = await profileStorage.create({
                            userId: signUpData.user.id,
                            fullName,
                            email,
                            phone,
                            location,
                            userType,
                            serviceCategory: userType === 'provider' ? category : undefined,
                            bio: '',
                            hourlyRate: 0,
                            experience: '',
                            skills: [],
                            portfolio: [],
                            availability: true,
                            verified: false,
                            rating: 0,
                            completedJobs: 0
                        });
                        
                        console.log('Profile created successfully:', createdProfile);
                        
                        // Refresh the profile in AuthContext
                        await refreshProfile();
                    } catch (profileError) {
                        console.error('Error creating profile:', profileError);
                        console.error('Profile error details:', {
                            message: profileError.message,
                            details: profileError.details,
                            hint: profileError.hint,
                            code: profileError.code
                        });
                        
                        // Store in localStorage as fallback
                        console.log('Storing profile in localStorage as fallback');
                        const fallbackProfile = {
                            id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                            userId: signUpData.user.id,
                            fullName,
                            email,
                            phone,
                            location,
                            userType,
                            serviceCategory: userType === 'provider' ? category : undefined,
                            bio: '',
                            hourlyRate: 0,
                            experience: '',
                            skills: [],
                            portfolio: [],
                            availability: true,
                            verified: false,
                            rating: 0,
                            completedJobs: 0,
                            avatarUrl: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        
                        if (typeof window !== 'undefined') {
                            localStorage.setItem(`profile_${signUpData.user.id}`, JSON.stringify(fallbackProfile));
                        }
                    }
                }
                
                // Clear form
                setFullName('');
                setEmail('');
                setPhone('');
                setLocation('');
                setCategory('');
                setPassword('');
                setConfirmPassword('');
                setTermsAccepted(false);
                
                // Redirect to appropriate dashboard based on user type
                // Use setTimeout to allow React to complete the current render cycle
                // Then use window.location for a hard redirect to avoid DOM conflicts
                setTimeout(() => {
                    if (userType === 'provider') {
                        window.location.href = '/provider/dashboard';
                    } else {
                        // Clients are redirected to services page
                        window.location.href = '/services';
                    }
                }, 1500);
            }
        } catch (err) {
            console.error('Unexpected signup error:', err)
            setError(`An unexpected error occurred: ${err.message || 'Please try again.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full max-w-lg bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-xl sm:rounded-2xl p-6 sm:p-8 mx-4'>
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Join PutMeOn
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">Create your account and get started</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{success}</span>
                    </div>
                )}

                {/* User Type Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">I want to:</Label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setUserType('client')}
                            disabled={loading}
                            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                                userType === 'client' 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-border hover:border-primary/50'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="text-center">
                                <User className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                                <div className="font-medium text-xs sm:text-sm">Hire Services</div>
                                <div className="text-xs text-muted-foreground hidden sm:block">Find professionals</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('provider')}
                            disabled={loading}
                            className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                                userType === 'provider' 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-border hover:border-primary/50'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="text-center">
                                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                                <div className="font-medium text-xs sm:text-sm">Offer Services</div>
                                <div className="text-xs text-muted-foreground hidden sm:block">Become a provider</div>
                            </div>
                        </button>
                    </div>
                </div>
                
                <div className='space-y-4'>
                    {/* Full Name */}
                    <div className='relative'>
                        <Label htmlFor="fullName" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="fullName"
                                type="text" 
                                placeholder='Enter your full name' 
                                required 
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={loading}
                            />
                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>

                    {/* Email */}
                    <div className='relative'>
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="email"
                                type="email" 
                                placeholder='Enter your email address' 
                                required 
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className='relative'>
                        <Label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="phone"
                                type="tel" 
                                placeholder='Enter your phone number' 
                                required 
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                            />
                            <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>

                    {/* Location */}
                    <div className='relative'>
                        <Label htmlFor="location" className="text-sm font-medium">
                            Location
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="location"
                                type="text" 
                                placeholder='Enter your city' 
                                required 
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                disabled={loading}
                            />
                            <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>

                    {/* Service Category (only for providers) */}
                    {userType === 'provider' && (
                        <div className='relative'>
                            <Label htmlFor="category" className="text-sm font-medium">
                                Primary Service Category
                            </Label>
                            <Select value={category} onValueChange={setCategory} disabled={loading}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select your main service category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="web-dev">Web Development</SelectItem>
                                    <SelectItem value="design">Graphic Design</SelectItem>
                                    <SelectItem value="events">Events & Weddings</SelectItem>
                                    <SelectItem value="writing">Content Writing</SelectItem>
                                    <SelectItem value="photography">Photography & Video</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Password */}
                    <div className='relative'>
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="password"
                                type="password" 
                                placeholder='Create a strong password' 
                                required 
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className='relative'>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <div className="relative mt-1">
                            <Input 
                                id="confirmPassword"
                                type="password" 
                                placeholder='Confirm your password' 
                                required 
                                className="pl-10 h-11 sm:h-12 text-sm sm:text-base"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 text-xs sm:text-sm">
                    <input 
                        type="checkbox" 
                        id="terms"
                        required
                        className="rounded border-border mt-0.5 flex-shrink-0" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        disabled={loading}
                    />
                    <label htmlFor="terms" className="text-muted-foreground leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" className="text-primary hover:text-primary/80 font-medium">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">
                            Privacy Policy
                        </Link>
                    </label>
                </div>
                
                <Button 
                    type="submit" 
                    className="w-full h-11 sm:h-12 text-sm sm:text-base" 
                    size="lg"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                
                <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignupForm;