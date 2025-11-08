/**
 * Script to create a super admin account (JavaScript version)
 * 
 * Usage:
 *   node scripts/create-super-admin.js --email=admin@example.com --password=SecurePassword123 --name="Admin Name"
 * 
 * Or run interactively:
 *   node scripts/create-super-admin.js
 * 
 * Environment Variables Required:
 *   VITE_SUPABASE_URL - Your Supabase project URL
 *   VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key
 *   SUPABASE_SERVICE_ROLE_KEY - Your Supabase service role key (recommended for admin operations)
 */

import { createClient } from '@supabase/supabase-js'
import readline from 'readline'
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
    console.error('\nOr set them as environment variables before running the script:')
    console.error('  Windows: set VITE_SUPABASE_URL=your_url && set VITE_SUPABASE_ANON_KEY=your_key')
    console.error('  Linux/Mac: export VITE_SUPABASE_URL=your_url && export VITE_SUPABASE_ANON_KEY=your_key')
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

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2)
    const data = {}

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
function getUserInput(prompt) {
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

// Create or update profile
async function createOrUpdateProfile(userId, data) {
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
                console.error('❌ Error updating profile:', updateError.message)
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
                console.error('❌ Error creating profile:', insertError.message)
                throw insertError
            }

            console.log('✅ Profile created successfully!')
        }
    } catch (error) {
        console.error('❌ Error with profile:', error.message)
        throw error
    }
}

// Create super admin account
async function createSuperAdmin(data) {
    try {
        console.log('\n🚀 Creating super admin account...\n')

        // Step 1: Create user in Supabase Auth
        console.log('📝 Step 1: Creating user account...')
        
        let userId
        let authData

        // Try to use admin API if service role key is available
        if (supabaseServiceKey && supabase.auth && typeof supabase.auth.admin !== 'undefined') {
            try {
                const { data: adminAuthData, error: adminAuthError } = await supabase.auth.admin.createUser({
                    email: data.email,
                    password: data.password,
                    email_confirm: true,
                    user_metadata: {
                        full_name: data.fullName,
                        role: 'super_admin'
                    }
                })

                if (adminAuthError) {
                    if (adminAuthError.message.includes('already registered') || adminAuthError.message.includes('already exists')) {
                        console.log('⚠️  User already exists. Attempting to sign in...')
                        
                        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                            email: data.email,
                            password: data.password
                        })

                        if (signInError) {
                            console.error('❌ Error: User exists but password is incorrect')
                            console.error('Please use the correct password or create a new account with a different email.')
                            process.exit(1)
                        }

                        userId = signInData.user.id
                        authData = signInData
                    } else {
                        throw adminAuthError
                    }
                } else if (adminAuthData && adminAuthData.user) {
                    userId = adminAuthData.user.id
                    authData = adminAuthData
                    console.log('✅ User account created successfully!')
                    console.log(`   User ID: ${userId}`)
                }
            } catch (error) {
                console.log('⚠️  Admin API error, falling back to regular signup...')
                console.log(`   Error: ${error.message}`)
            }
        }

        // If admin API didn't work or isn't available, use regular signup
        if (!userId) {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        role: 'super_admin'
                    }
                }
            })

            if (signUpError) {
                if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
                    console.log('⚠️  User already exists. Attempting to sign in...')
                    
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email: data.email,
                        password: data.password
                    })

                    if (signInError) {
                        console.error('❌ Error: User exists but password is incorrect')
                        console.error('Please use the correct password or create a new account with a different email.')
                        process.exit(1)
                    }

                    userId = signInData.user.id
                    authData = signInData
                    console.log('✅ User account found!')
                } else {
                    console.error('❌ Error creating user:', signUpError.message)
                    process.exit(1)
                }
            } else {
                userId = signUpData.user?.id
                authData = signUpData
                console.log('✅ User account created successfully!')
                console.log(`   User ID: ${userId}`)
                
                if (!signUpData.user) {
                    console.error('❌ Failed to create user')
                    process.exit(1)
                }
            }
        }

        // Step 2: Create or update profile
        console.log('\n📝 Step 2: Creating admin profile...')
        await createOrUpdateProfile(userId, data)

        console.log('\n✅ Super admin account created successfully!')
        console.log('\n📋 Account Details:')
        console.log(`   Email: ${data.email}`)
        console.log(`   Name: ${data.fullName}`)
        console.log(`   Role: Super Admin`)
        console.log(`   User ID: ${userId}`)
        console.log('\n🎉 You can now log in to the admin dashboard!')
        console.log(`   Login at: /login`)
        console.log(`   Admin Dashboard: /admin/dashboard`)

    } catch (error) {
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

// Main function
async function main() {
    console.log('🔐 Super Admin Account Creator')
    console.log('================================\n')

    // Parse command line arguments
    const args = parseArgs()

    let adminData

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
        const password = args.password || await getUserInput('Password (will be hidden): ')
        const fullName = args.fullName || await getUserInput('Full Name: ')
        const phone = args.phone || await getUserInput('Phone (optional, press Enter to skip): ')
        const location = args.location || await getUserInput('Location (optional, press Enter to skip): ')

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

