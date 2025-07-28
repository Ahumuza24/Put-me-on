import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { User, Mail, Lock, Phone, MapPin, Briefcase } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

const SignupForm: React.FC = () => {
    const [userType, setUserType] = useState<'client' | 'provider'>('client');

    return (
        <div className='w-full max-w-lg bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-2xl p-8'>
            <form className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Join PutMeOn
                    </h1>
                    <p className="text-muted-foreground mt-2">Create your account and get started</p>
                </div>

                {/* User Type Selection */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">I want to:</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setUserType('client')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                userType === 'client' 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-border hover:border-primary/50'
                            }`}
                        >
                            <div className="text-center">
                                <User className="h-6 w-6 mx-auto mb-2" />
                                <div className="font-medium">Hire Services</div>
                                <div className="text-xs text-muted-foreground">Find professionals</div>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('provider')}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                userType === 'provider' 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-border hover:border-primary/50'
                            }`}
                        >
                            <div className="text-center">
                                <Briefcase className="h-6 w-6 mx-auto mb-2" />
                                <div className="font-medium">Offer Services</div>
                                <div className="text-xs text-muted-foreground">Become a provider</div>
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
                                className="pl-10"
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
                                className="pl-10"
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
                                className="pl-10"
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
                                placeholder='Enter your city or area' 
                                required 
                                className="pl-10"
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
                            <Select>
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
                                className="pl-10"
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
                                className="pl-10"
                            />
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground'/>
                        </div>
                    </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2 text-sm">
                    <input 
                        type="checkbox" 
                        id="terms"
                        required
                        className="rounded border-border mt-0.5" 
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
                
                <Button type="submit" className="w-full" size="lg">
                    Create Account
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
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