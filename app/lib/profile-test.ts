// Simple profile test utilities
import { profileStorage } from './profile-storage'

export const testProfileFlow = async (userId: string) => {
    try {
        console.log('🧪 Testing complete profile flow...')
        
        // Test 1: Create a test profile
        console.log('1. Creating test profile...')
        const testProfile = await profileStorage.create({
            userId,
            fullName: 'Test Provider',
            email: 'test@example.com',
            phone: '1234567890',
            location: 'Test City',
            userType: 'provider',
            serviceCategory: 'web-development',
            bio: 'Test bio for debugging',
            hourlyRate: 50,
            experience: '5 years',
            skills: ['React', 'Node.js', 'TypeScript'],
            portfolio: [],
            availability: true,
            verified: false,
            rating: 0,
            completedJobs: 0
        })
        
        console.log('✅ Profile created:', testProfile)
        
        // Test 2: Retrieve the profile
        console.log('2. Retrieving profile...')
        const retrievedProfile = await profileStorage.getByUserId(userId)
        
        if (retrievedProfile) {
            console.log('✅ Profile retrieved:', retrievedProfile)
        } else {
            console.log('❌ Profile not found after creation')
            return { success: false, error: 'Profile not found after creation' }
        }
        
        // Test 3: Update the profile
        console.log('3. Updating profile...')
        const updatedProfile = await profileStorage.update(userId, {
            fullName: 'Updated Test Provider',
            location: 'Updated Test City',
            bio: 'Updated test bio'
        })
        
        if (updatedProfile) {
            console.log('✅ Profile updated:', updatedProfile)
        } else {
            console.log('❌ Profile update failed')
            return { success: false, error: 'Profile update failed' }
        }
        
        // Test 4: Retrieve updated profile
        console.log('4. Retrieving updated profile...')
        const finalProfile = await profileStorage.getByUserId(userId)
        
        if (finalProfile) {
            console.log('✅ Final profile:', finalProfile)
            return { 
                success: true, 
                profile: finalProfile,
                message: 'Profile flow test completed successfully!'
            }
        } else {
            console.log('❌ Final profile retrieval failed')
            return { success: false, error: 'Final profile retrieval failed' }
        }
        
    } catch (error) {
        console.error('❌ Profile flow test failed:', error)
        return { 
            success: false, 
            error: error.message,
            details: error
        }
    }
}

export const clearTestProfiles = async (userId: string) => {
    try {
        console.log('🧹 Clearing test profiles...')
        
        // Try to delete from Supabase first
        try {
            await profileStorage.delete(userId)
            console.log('✅ Profile deleted from Supabase')
        } catch (error) {
            console.log('⚠️ Supabase delete failed (expected if not set up):', error.message)
        }
        
        // Clear from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`profile_${userId}`)
            console.log('✅ Profile cleared from localStorage')
        }
        
        return { success: true, message: 'Test profiles cleared' }
        
    } catch (error) {
        console.error('❌ Clear profiles failed:', error)
        return { success: false, error: error.message }
    }
}
