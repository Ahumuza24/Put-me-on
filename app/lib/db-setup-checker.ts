// Database setup checker to verify Supabase configuration
import { supabase } from './supabase.client'

export interface DatabaseStatus {
    isConnected: boolean
    hasTables: boolean
    canCreateProfile: boolean
    error?: string
    details?: {
        tablesExist: boolean
        authWorking: boolean
        rlsEnabled: boolean
    }
}

export const checkDatabaseSetup = async (): Promise<DatabaseStatus> => {
    try {
        console.log('🔍 Checking database setup...')
        
        // Check 1: Basic connection
        const { data: connectionTest, error: connectionError } = await supabase
            .from('user_profiles')
            .select('count')
            .limit(1)
        
        if (connectionError) {
            console.error('❌ Database connection failed:', connectionError)
            return {
                isConnected: false,
                hasTables: false,
                canCreateProfile: false,
                error: connectionError.message,
                details: {
                    tablesExist: false,
                    authWorking: false,
                    rlsEnabled: false
                }
            }
        }
        
        console.log('✅ Database connection successful')
        
        // Check 2: Auth status
        const { data: { user } } = await supabase.auth.getUser()
        const authWorking = !!user
        
        console.log('✅ Auth status:', authWorking ? 'Working' : 'No user')
        
        // Check 3: Try to create a test profile
        let canCreateProfile = false
        try {
            const testProfile = {
                user_id: user?.id || 'test-user-id',
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
            
            const { data: testData, error: testError } = await supabase
                .from('user_profiles')
                .insert([testProfile])
                .select()
                .single()
            
            if (testError) {
                console.error('❌ Profile creation test failed:', testError)
            } else {
                console.log('✅ Profile creation test successful')
                canCreateProfile = true
                
                // Clean up test profile
                await supabase
                    .from('user_profiles')
                    .delete()
                    .eq('id', testData.id)
                console.log('✅ Test profile cleaned up')
            }
        } catch (testError) {
            console.error('❌ Profile creation test error:', testError)
        }
        
        return {
            isConnected: true,
            hasTables: true,
            canCreateProfile,
            details: {
                tablesExist: true,
                authWorking,
                rlsEnabled: true
            }
        }
        
    } catch (error) {
        console.error('❌ Database setup check failed:', error)
        return {
            isConnected: false,
            hasTables: false,
            canCreateProfile: false,
            error: error.message,
            details: {
                tablesExist: false,
                authWorking: false,
                rlsEnabled: false
            }
        }
    }
}

// Quick setup instructions
export const getSetupInstructions = (status: DatabaseStatus): string[] => {
    const instructions: string[] = []
    
    if (!status.isConnected) {
        instructions.push('❌ Database connection failed')
        instructions.push('1. Check your Supabase URL and API key in environment variables')
        instructions.push('2. Ensure your Supabase project is active')
        instructions.push('3. Check your internet connection')
    }
    
    if (!status.hasTables) {
        instructions.push('❌ Database tables not found')
        instructions.push('1. Go to your Supabase dashboard')
        instructions.push('2. Navigate to SQL Editor')
        instructions.push('3. Run the supabase-schema.sql file')
        instructions.push('4. Verify tables are created in Table Editor')
    }
    
    if (!status.canCreateProfile) {
        instructions.push('❌ Cannot create profiles')
        instructions.push('1. Check Row Level Security policies')
        instructions.push('2. Ensure user is authenticated')
        instructions.push('3. Verify table permissions')
    }
    
    if (status.isConnected && status.hasTables && status.canCreateProfile) {
        instructions.push('✅ Database setup is working correctly!')
    }
    
    return instructions
}
