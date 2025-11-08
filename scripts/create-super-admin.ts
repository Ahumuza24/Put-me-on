/**
 * Script to create a super admin account
 * 
 * Usage:
 *   npm run create-admin --email=admin@example.com --password=SecurePassword123
 *   or
 *   tsx scripts/create-super-admin.ts --email=admin@example.com --password=SecurePassword123
 * 
 * Environment Variables Required:
 *   VITE_SUPABASE_URL - Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key
 *   SUPABASE_SERVICE_ROLE_KEY - Your Supabase service role key (for admin operations)
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'
import * as process from 'process'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env')

// Try to load .env file from project root
if (existsSync(envPath)) {
    config({ path: envPath })
    console.log(`✅ Loaded environment variables from: ${envPath}`)
} else {
    // Try to load from current working directory
    config()
    if (existsSync('.env')) {
        console.log('✅ Loaded environment variables from .env file in current directory')
    } else {
        console.log('ℹ️  No .env file found, using environment variables from process.env')
    }
}

// Get environment variables (matching the existing codebase pattern)
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debug: Show what was loaded (without exposing sensitive data)
console.log('\n📋 Environment Variables Status:')
console.log(`   VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' + (supabaseUrl.length > 50 ? ` (${supabaseUrl.substring(0, 30)}...)` : '') : '❌ Missing'}`)
console.log(`   VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' + (supabaseKey.length > 20 ? ` (${supabaseKey.substring(0, 20)}...)` : '') : '❌ Missing'}`)
console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set (optional)' : '⚠️  Not set (optional but recommended)'}`)
console.log()

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase environment variables')
    console.error('\nMissing variables:')
    if (!supabaseUrl) console.error('  - VITE_SUPABASE_URL')
    if (!supabaseKey) console.error('  - VITE_SUPABASE_ANON_KEY')
    
    console.error('\nPlease create a .env file in the project root with:')
    console.error('VITE_SUPABASE_URL=your_supabase_url')
    console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key')
    console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional but recommended)')
    console.error(`\nChecked for .env file at: ${envPath}`)
    console.error('\n💡 Tip: Make sure your .env file is in the project root directory (same level as package.json)')
    process.exit(1)
}

// Create Supabase client
// Use service role key if available for admin operations, otherwise use anon key
const supabase = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
              autoRefreshToken: false,
              persistSession: false
          }
      })
    : createClient(supabaseUrl, supabaseKey, {
          auth: {
              autoRefreshToken: false,
              persistSession: false
          }
      })

interface AdminData {
    email: string
    password: string
    fullName: string
    phone?: string
    location?: string
}

// Parse command line arguments
function parseArgs(): Partial<AdminData> {
    const args = process.argv.slice(2)
    const data: Partial<AdminData> = {}

    args.forEach(arg => {
        if (arg.startsWith('--email=')) {
            data.email = arg.split('=')[1]
        } else if (arg.startsWith('--password=')) {
            data.password = arg.split('=')[1]
        } else if (arg.startsWith('--name=')) {
            data.fullName = arg.split('=')[1]
        } else if (arg.startsWith('--phone=')) {
            data.phone = arg.split('=')[1]
        } else if (arg.startsWith('--location=')) {
            data.location = arg.split('=')[1]
        }
    })

    return data
}

// Get input from user
async function getUserInput(prompt: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise(resolve => {
        rl.question(prompt, answer => {
            rl.close()
            resolve(answer)
        })
    })
}

// Create super admin account
async function createSuperAdmin(data: AdminData): Promise<void> {
    try {
        console.log('\n🚀 Creating super admin account...\n')

        // Step 1: Create user in Supabase Auth
        console.log('📝 Step 1: Creating user account...')
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: data.email,
            password: data.password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                full_name: data.fullName,
                role: 'super_admin'
            }
        })

        if (authError) {
            // If user already exists, try to sign in and get the user
            if (authError.message.includes('already registered')) {
                console.log('⚠️  User already exists. Attempting to update existing user...')
                
                // Try to sign in to get the user ID
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password
                })

                if (signInError) {
                    console.error('❌ Error signing in:', signInError.message)
                    console.error('Please check the password or create a new account with a different email.')
                    process.exit(1)
                }

                if (!signInData.user) {
                    console.error('❌ Failed to get user information')
                    process.exit(1)
                }

                console.log('✅ User account found. Updating profile...')
                await createOrUpdateProfile(signInData.user.id, data)
                return
            }

            console.error('❌ Error creating user:', authError.message)
            process.exit(1)
        }

        if (!authData.user) {
            console.error('❌ Failed to create user')
            process.exit(1)
        }

        console.log('✅ User account created successfully!')
        console.log(`   User ID: ${authData.user.id}`)

        // Step 2: Create profile
        console.log('\n📝 Step 2: Creating admin profile...')
        await createOrUpdateProfile(authData.user.id, data)

        console.log('\n✅ Super admin account created successfully!')
        console.log('\n📋 Account Details:')
        console.log(`   Email: ${data.email}`)
        console.log(`   Name: ${data.fullName}`)
        console.log(`   Role: Super Admin`)
        console.log(`   User ID: ${authData.user.id}`)
        console.log('\n🎉 You can now log in to the admin dashboard!')
        console.log(`   URL: ${supabaseUrl.replace('/rest/v1', '')}/admin/dashboard`)

    } catch (error: any) {
        console.error('\n❌ Error creating super admin:', error.message)
        if (error.details) {
            console.error('   Details:', error.details)
        }
        if (error.hint) {
            console.error('   Hint:', error.hint)
        }
        
        // Provide helpful error message for constraint violations
        if (error.message && error.message.includes('user_profiles_user_type_check')) {
            console.error('\n💡 Quick Fix:')
            console.error('   The database needs to be updated to allow "super_admin" user type.')
            console.error('   See scripts/fix-user-type-constraint.md for instructions.')
        }
        
        process.exit(1)
    }
}

// Create or update profile
async function createOrUpdateProfile(userId: string, data: AdminData): Promise<void> {
    try {
        // Check if profile already exists
        const { data: existingProfile, error: checkError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (existingProfile && !checkError) {
            // Update existing profile
            console.log('⚠️  Profile already exists. Updating to super_admin...')
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({
                    user_type: 'super_admin',
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    location: data.location || '',
                    verified: true
                })
                .eq('user_id', userId)

            if (updateError) {
                // Check if it's a constraint violation
                if (updateError.message.includes('user_profiles_user_type_check')) {
                    console.error('❌ Error: Database constraint violation')
                    console.error('   The database constraint does not allow "super_admin" as a user type.')
                    console.error('\n📋 Solution:')
                    console.error('   1. Go to Supabase Dashboard → SQL Editor')
                    console.error('   2. Run this SQL to update the constraint:')
                    console.error('\n   ALTER TABLE user_profiles')
                    console.error('   DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;')
                    console.error('\n   ALTER TABLE user_profiles')
                    console.error('   ADD CONSTRAINT user_profiles_user_type_check')
                    console.error('   CHECK (user_type IN (\'client\', \'provider\', \'admin\', \'super_admin\'));')
                    console.error('\n   Or see scripts/fix-user-type-constraint.md for detailed instructions.')
                } else {
                    console.error('❌ Error updating profile:', updateError.message)
                }
                throw updateError
            }

            console.log('✅ Profile updated successfully!')
        } else {
            // Create new profile
            const { error: insertError } = await supabase
                .from('user_profiles')
                .insert([{
                    user_id: userId,
                    full_name: data.fullName,
                    email: data.email,
                    phone: data.phone || '',
                    location: data.location || '',
                    user_type: 'super_admin',
                    verified: true,
                    availability: true,
                    rating: 0,
                    completed_jobs: 0
                }])

            if (insertError) {
                // Check if it's a constraint violation
                if (insertError.message.includes('user_profiles_user_type_check')) {
                    console.error('❌ Error: Database constraint violation')
                    console.error('   The database constraint does not allow "super_admin" as a user type.')
                    console.error('\n📋 Solution:')
                    console.error('   1. Go to Supabase Dashboard → SQL Editor')
                    console.error('   2. Run this SQL to update the constraint:')
                    console.error('\n   ALTER TABLE user_profiles')
                    console.error('   DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;')
                    console.error('\n   ALTER TABLE user_profiles')
                    console.error('   ADD CONSTRAINT user_profiles_user_type_check')
                    console.error('   CHECK (user_type IN (\'client\', \'provider\', \'admin\', \'super_admin\'));')
                    console.error('\n   Or see scripts/fix-user-type-constraint.md for detailed instructions.')
                } else {
                    console.error('❌ Error creating profile:', insertError.message)
                }
                throw insertError
            }

            console.log('✅ Profile created successfully!')
        }
    } catch (error: any) {
        console.error('❌ Error with profile:', error.message)
        if (error.details) {
            console.error('   Details:', error.details)
        }
        if (error.hint) {
            console.error('   Hint:', error.hint)
        }
        throw error
    }
}

// Main function
async function main() {
    console.log('🔐 Super Admin Account Creator')
    console.log('================================\n')

    // Parse command line arguments
    const args = parseArgs()

    let adminData: AdminData

    // If all required data is provided via arguments, use them
    if (args.email && args.password && args.fullName) {
        adminData = {
            email: args.email,
            password: args.password,
            fullName: args.fullName,
            phone: args.phone,
            location: args.location
        }
    } else {
        // Otherwise, prompt for input
        console.log('Please provide the following information:\n')

        const email = args.email || await getUserInput('Email: ')
        const password = args.password || await getUserInput('Password: ')
        const fullName = args.fullName || await getUserInput('Full Name: ')
        const phone = args.phone || await getUserInput('Phone (optional): ')
        const location = args.location || await getUserInput('Location (optional): ')

        if (!email || !password || !fullName) {
            console.error('❌ Error: Email, password, and full name are required')
            process.exit(1)
        }

        adminData = {
            email: email.trim(),
            password: password.trim(),
            fullName: fullName.trim(),
            phone: phone.trim() || undefined,
            location: location.trim() || undefined
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(adminData.email)) {
        console.error('❌ Error: Invalid email format')
        process.exit(1)
    }

    // Validate password strength
    if (adminData.password.length < 6) {
        console.error('❌ Error: Password must be at least 6 characters long')
        process.exit(1)
    }

    // Create the super admin account
    await createSuperAdmin(adminData)
}

// Run the script
main().catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
})

