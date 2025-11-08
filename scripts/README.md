# Admin Scripts

This directory contains utility scripts for managing the PutMeOn platform.

## create-super-admin.js

Script to create a super admin account for the platform.

### Prerequisites

1. **Install Dependencies**: Make sure `dotenv` is installed (it's included in devDependencies):
   ```bash
   npm install
   ```

2. **Environment Variables**: Set up your `.env` file in the project root with the same variables used in the codebase:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional but recommended)
   ```
   
   Note: These are the same environment variables used in `app/lib/supabase.client.ts`

2. **Supabase Service Role Key** (Recommended):
   - Go to your Supabase Dashboard
   - Navigate to Settings → API
   - Copy the `service_role` key (keep this secret!)
   - Add it to your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`

### Usage

#### Option 1: Interactive Mode

Run the script without arguments to be prompted for information:

```bash
node scripts/create-super-admin.js
```

#### Option 2: Command Line Arguments

Provide all required information via command line arguments:

```bash
node scripts/create-super-admin.js --email=admin@example.com --password=SecurePassword123 --name="Admin Name"
```

#### Option 3: Partial Arguments

Provide some arguments and be prompted for the rest:

```bash
node scripts/create-super-admin.js --email=admin@example.com --name="Admin Name"
# Will prompt for password
```

### Arguments

- `--email=email@example.com` - Admin email address (required)
- `--password=YourPassword` - Admin password (required, min 6 characters)
- `--name="Full Name"` - Admin full name (required)
- `--phone="+1234567890"` - Phone number (optional)
- `--location="City, Country"` - Location (optional)

### Examples

```bash
# Create admin with all details
node scripts/create-super-admin.js \
  --email=admin@putmeon.com \
  --password=Admin123! \
  --name="Super Admin" \
  --phone="+256700000000" \
  --location="Kampala, Uganda"

# Create admin with minimal details
node scripts/create-super-admin.js \
  --email=admin@putmeon.com \
  --password=Admin123! \
  --name="Super Admin"

# Interactive mode
node scripts/create-super-admin.js
```

### What the Script Does

1. **Creates User Account**: Creates a new user in Supabase Auth with the provided email and password
2. **Creates Admin Profile**: Creates a user profile with `user_type` set to `super_admin`
3. **Auto-verifies**: Sets the profile as verified automatically
4. **Handles Existing Users**: If the user already exists, it updates the profile to super_admin

### Troubleshooting

#### Error: "User already registered"
- The user account already exists
- The script will attempt to sign in and update the profile
- If the password is incorrect, you'll need to reset it or use a different email

#### Error: "Missing Supabase environment variables"
- Make sure your `.env` file has the required variables
- Or set them as environment variables before running the script

#### Error: "Permission denied" or "RLS policy violation"
- Make sure you're using the `SUPABASE_SERVICE_ROLE_KEY` for admin operations
- The service role key bypasses RLS policies
- Without it, the script may fail if RLS policies are restrictive

#### Error: "Table 'user_profiles' does not exist"
- Make sure your Supabase database is set up correctly
- Run the database migrations if needed
- Check that the `user_profiles` table exists

### Security Notes

⚠️ **Important Security Considerations:**

1. **Service Role Key**: The service role key has full access to your database. Keep it secret and never commit it to version control.

2. **Password Security**: Use a strong password for admin accounts. Consider using a password manager.

3. **Environment Variables**: Never commit your `.env` file to version control. Add it to `.gitignore`.

4. **Admin Access**: Super admin accounts have full control over the platform. Use them responsibly.

### Alternative: Manual Creation

If the script doesn't work, you can manually create a super admin:

1. **Create User Account**:
   - Sign up normally through the application
   - Or create user in Supabase Dashboard → Authentication → Users

2. **Update Profile**:
   - Go to Supabase Dashboard → Table Editor → `user_profiles`
   - Find the user's profile
   - Update `user_type` to `super_admin`
   - Set `verified` to `true`

3. **Verify**:
   - Log in with the account
   - You should be redirected to `/admin/dashboard`

### Support

If you encounter issues:
1. Check the error messages for specific details
2. Verify your Supabase setup
3. Check that all required tables exist
4. Ensure environment variables are set correctly

