// Profile storage utilities for managing user profile data with Supabase
import { supabase } from './supabase.client'

export interface UserProfile {
    id: string
    userId: string
    fullName: string
    email: string
    phone: string
    location: string
    userType: 'client' | 'provider' | 'admin' | 'super_admin'
    serviceCategory?: string
    bio?: string
    hourlyRate?: number
    experience?: string
    skills?: string[]
    portfolio?: string[]
    availability?: boolean
    verified?: boolean
    rating?: number
    completedJobs?: number
    avatarUrl?: string
    createdAt: string
    updatedAt: string
}

export const profileStorage = {
    // Create a new profile
    create: async (profileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> => {
        try {
            // Check if user is authenticated
            const { data: { user } } = await supabase.auth.getUser()
            console.log('Current authenticated user:', user?.id)
            console.log('Profile data user ID:', profileData.userId)
            
            // If user is not authenticated, try to get the session
            if (!user) {
                console.log('No authenticated user found, checking session...')
                const { data: { session } } = await supabase.auth.getSession()
                if (!session?.user) {
                    throw new Error('User not authenticated. Cannot create profile.')
                }
                console.log('Found user in session:', session.user.id)
            }
            
            const { data, error } = await supabase
                .from('user_profiles')
                .insert([{
                    user_id: profileData.userId,
                    full_name: profileData.fullName,
                    email: profileData.email,
                    phone: profileData.phone,
                    location: profileData.location,
                    user_type: profileData.userType,
                    service_category: profileData.serviceCategory,
                    bio: profileData.bio,
                    hourly_rate: profileData.hourlyRate || 0,
                    experience: profileData.experience,
                    skills: profileData.skills || [],
                    portfolio: profileData.portfolio || [],
                    availability: profileData.availability ?? true,
                    verified: profileData.verified ?? false,
                    rating: profileData.rating || 0,
                    completed_jobs: profileData.completedJobs || 0,
                    avatar_url: profileData.avatarUrl
                }])
                .select()
                .single()

            if (error) {
                console.error('Error creating profile:', error)
                console.error('Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                })
                throw error
            }

            // Transform the data to match our interface
            return {
                id: data.id,
                userId: data.user_id,
                fullName: data.full_name,
                email: data.email,
                phone: data.phone,
                location: data.location,
                userType: data.user_type,
                serviceCategory: data.service_category,
                bio: data.bio,
                hourlyRate: data.hourly_rate,
                experience: data.experience,
                skills: data.skills,
                portfolio: data.portfolio,
                availability: data.availability,
                verified: data.verified,
                rating: data.rating,
                completedJobs: data.completed_jobs,
                avatarUrl: data.avatar_url,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            }
        } catch (error) {
            console.error('Error creating profile:', error)
            
            // Fallback to localStorage if Supabase fails
            console.log('Falling back to localStorage for profile storage')
            const fallbackProfile: UserProfile = {
                id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: profileData.userId,
                fullName: profileData.fullName,
                email: profileData.email,
                phone: profileData.phone,
                location: profileData.location,
                userType: profileData.userType,
                serviceCategory: profileData.serviceCategory,
                bio: profileData.bio || '',
                hourlyRate: profileData.hourlyRate || 0,
                experience: profileData.experience || '',
                skills: profileData.skills || [],
                portfolio: profileData.portfolio || [],
                availability: profileData.availability ?? true,
                verified: profileData.verified ?? false,
                rating: profileData.rating || 0,
                completedJobs: profileData.completedJobs || 0,
                avatarUrl: profileData.avatarUrl,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            
            // Store in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(`profile_${profileData.userId}`, JSON.stringify(fallbackProfile))
            }
            
            return fallbackProfile
        }
    },

    // Get profile by user ID
    getByUserId: async (userId: string): Promise<UserProfile | null> => {
        try {
            console.log('Fetching profile for user ID:', userId)
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error) {
                if (error.code === 'PGRST116') {
                    // No profile found
                    console.log('No profile found for user:', userId)
                    return null
                }
                console.error('Error fetching profile:', error)
                throw error
            }

            console.log('Profile data from database:', data)

            // Transform the data to match our interface
            return {
                id: data.id,
                userId: data.user_id,
                fullName: data.full_name,
                email: data.email,
                phone: data.phone,
                location: data.location,
                userType: data.user_type,
                serviceCategory: data.service_category,
                bio: data.bio,
                hourlyRate: data.hourly_rate,
                experience: data.experience,
                skills: data.skills,
                portfolio: data.portfolio,
                availability: data.availability,
                verified: data.verified,
                rating: data.rating,
                completedJobs: data.completed_jobs,
                avatarUrl: data.avatar_url,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            
            // Fallback to localStorage if Supabase fails
            console.log('Falling back to localStorage for profile retrieval')
            if (typeof window !== 'undefined') {
                const storedProfile = localStorage.getItem(`profile_${userId}`)
                if (storedProfile) {
                    try {
                        return JSON.parse(storedProfile)
                    } catch (parseError) {
                        console.error('Error parsing stored profile:', parseError)
                    }
                }
            }
            
            return null
        }
    },

    // Update profile
    update: async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
        try {
            // Transform updates to match database schema
            const dbUpdates: any = {}
            if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName
            if (updates.email !== undefined) dbUpdates.email = updates.email
            if (updates.phone !== undefined) dbUpdates.phone = updates.phone
            if (updates.location !== undefined) dbUpdates.location = updates.location
            if (updates.userType !== undefined) dbUpdates.user_type = updates.userType
            if (updates.serviceCategory !== undefined) dbUpdates.service_category = updates.serviceCategory
            if (updates.bio !== undefined) dbUpdates.bio = updates.bio
            if (updates.hourlyRate !== undefined) dbUpdates.hourly_rate = updates.hourlyRate
            if (updates.experience !== undefined) dbUpdates.experience = updates.experience
            if (updates.skills !== undefined) dbUpdates.skills = updates.skills
            if (updates.portfolio !== undefined) dbUpdates.portfolio = updates.portfolio
            if (updates.availability !== undefined) dbUpdates.availability = updates.availability
            if (updates.verified !== undefined) dbUpdates.verified = updates.verified
            if (updates.rating !== undefined) dbUpdates.rating = updates.rating
            if (updates.completedJobs !== undefined) dbUpdates.completed_jobs = updates.completedJobs
            if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl

            const { data, error } = await supabase
                .from('user_profiles')
                .update(dbUpdates)
                .eq('user_id', userId)
                .select()
                .single()

            if (error) {
                console.error('Error updating profile:', error)
                throw error
            }

            // Transform the data to match our interface
            return {
                id: data.id,
                userId: data.user_id,
                fullName: data.full_name,
                email: data.email,
                phone: data.phone,
                location: data.location,
                userType: data.user_type,
                serviceCategory: data.service_category,
                bio: data.bio,
                hourlyRate: data.hourly_rate,
                experience: data.experience,
                skills: data.skills,
                portfolio: data.portfolio,
                availability: data.availability,
                verified: data.verified,
                rating: data.rating,
                completedJobs: data.completed_jobs,
                avatarUrl: data.avatar_url,
                createdAt: data.created_at,
                updatedAt: data.updated_at
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            
            // Fallback to localStorage if Supabase fails
            console.log('Falling back to localStorage for profile update')
            if (typeof window !== 'undefined') {
                const storedProfile = localStorage.getItem(`profile_${userId}`)
                if (storedProfile) {
                    try {
                        const currentProfile = JSON.parse(storedProfile)
                        const updatedProfile = {
                            ...currentProfile,
                            ...updates,
                            updatedAt: new Date().toISOString()
                        }
                        localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile))
                        return updatedProfile
                    } catch (parseError) {
                        console.error('Error parsing stored profile for update:', parseError)
                    }
                }
            }
            
            throw error
        }
    },

    // Get all profiles (for admin purposes)
    getAll: async (): Promise<UserProfile[]> => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching profiles:', error)
                throw error
            }

            return data.map(profile => ({
                id: profile.id,
                userId: profile.user_id,
                fullName: profile.full_name,
                email: profile.email,
                phone: profile.phone,
                location: profile.location,
                userType: profile.user_type,
                serviceCategory: profile.service_category,
                bio: profile.bio,
                hourlyRate: profile.hourly_rate,
                experience: profile.experience,
                skills: profile.skills,
                portfolio: profile.portfolio,
                availability: profile.availability,
                verified: profile.verified,
                rating: profile.rating,
                completedJobs: profile.completed_jobs,
                avatarUrl: profile.avatar_url,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
            }))
        } catch (error) {
            console.error('Error fetching profiles:', error)
            return []
        }
    },

    // Delete profile
    delete: async (userId: string): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .delete()
                .eq('user_id', userId)

            if (error) {
                console.error('Error deleting profile:', error)
                throw error
            }

            return true
        } catch (error) {
            console.error('Error deleting profile:', error)
            return false
        }
    }
}
