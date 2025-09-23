// Test database connection and schema
import { supabase } from './supabase.client'

export const testDatabaseConnection = async () => {
    try {
        console.log('Testing database connection...')
        
        // Test 1: Check if user_profiles table exists
        const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('count')
            .limit(1)
        
        if (profilesError) {
            console.error('Error accessing user_profiles table:', profilesError)
            return { success: false, error: profilesError.message }
        }
        
        console.log('✅ user_profiles table accessible')
        
        // Test 2: Check if service_categories table exists
        const { data: categories, error: categoriesError } = await supabase
            .from('service_categories')
            .select('count')
            .limit(1)
        
        if (categoriesError) {
            console.error('Error accessing service_categories table:', categoriesError)
            return { success: false, error: categoriesError.message }
        }
        
        console.log('✅ service_categories table accessible')
        
        // Test 3: Check current user
        const { data: { user } } = await supabase.auth.getUser()
        console.log('Current user:', user?.id)
        
        return { success: true, user: user?.id }
        
    } catch (error) {
        console.error('Database connection test failed:', error)
        return { success: false, error: error.message }
    }
}

// Test profile creation
export const testProfileCreation = async (userId: string) => {
    try {
        console.log('Testing profile creation for user:', userId)
        
        // First, verify the user exists in auth.users
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || user.id !== userId) {
            return { 
                success: false, 
                error: 'User not authenticated or user ID mismatch. Please sign in first.' 
            }
        }
        
        console.log('✅ User is authenticated:', user.id)
        
        const testProfile = {
            user_id: userId,
            full_name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            location: 'Test City',
            user_type: 'provider',
            service_category: 'web-development',
            bio: 'Test bio',
            hourly_rate: 50,
            experience: '5 years',
            skills: ['React', 'Node.js'],
            portfolio: [],
            availability: true,
            verified: false,
            rating: 0,
            completed_jobs: 0
        }
        
        const { data, error } = await supabase
            .from('user_profiles')
            .insert([testProfile])
            .select()
            .single()
        
        if (error) {
            console.error('Error creating test profile:', error)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Test profile created:', data)
        
        // Clean up test profile
        await supabase
            .from('user_profiles')
            .delete()
            .eq('id', data.id)
        
        console.log('✅ Test profile cleaned up')
        
        return { success: true, profile: data }
        
    } catch (error) {
        console.error('Profile creation test failed:', error)
        return { success: false, error: error.message }
    }
}
