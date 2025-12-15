# Supabase Analytics Setup Instructions

## Step 1: Set up the Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `vxmffyxfqxapbrrmpfhd`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Click **Run** to create the tables and policies

## Step 2: Get Your Supabase Anon Key

1. In your Supabase Dashboard, go to **Settings** > **API**
2. Find the "Project API keys" section
3. Copy the **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. Open `supabase-config.js` file
5. Replace the placeholder `SUPABASE_ANON_KEY` value with your actual key

Example:
```javascript
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_KEY_HERE';
```

## Step 3: Deploy and Test

After completing steps 1 and 2:

1. Deploy your website or test locally
2. Visit the homepage - it should track your visit automatically
3. Submit a message through the contact form
4. Go to `/admin.html` to see the analytics dashboard
5. You should see:
   - Current visitors count
   - Total messages
   - Total visitors
   - List of recent messages with location data
   - List of recent visitors with location data

## Troubleshooting

### Check if data is being saved:
1. Go to Supabase Dashboard > **Table Editor**
2. Click on the `visitors` table - you should see visitor records
3. Click on the `messages` table - you should see message records

### Check browser console:
- Open browser DevTools (F12) and check the Console tab
- You should see messages like:
  - "Supabase client initialized"
  - "Visitor saved to Supabase successfully"
  - "Message saved to Supabase successfully"

### If you see errors:
- Make sure you ran the SQL schema script
- Verify your anon key is correct
- Check that Row Level Security policies are enabled
- Make sure you're connected to the internet

## What Gets Tracked

### Visitor Analytics:
- Unique visitor ID (session-based)
- Timestamp of visit
- Page visited
- Country, City, Region (from IP geolocation)
- IP address
- User agent (browser info)

### Message Analytics:
- Sender name and email
- Message content
- Timestamp
- Visitor ID (links message to visitor)
- Location data (Country, City, Region, IP)

## Admin Dashboard Features

The admin dashboard (`admin.html`) displays:

1. **Stats Cards:**
   - Current Visitors (last hour)
   - Total Messages
   - Total Visitors

2. **Recent Messages:**
   - Sender name and email
   - Message content
   - Location and IP
   - Visitor ID

3. **Recent Visitors:**
   - Visitor ID
   - Visit time
   - Location and IP
   - Page visited

Dashboard auto-refreshes every 30 seconds to show latest data.
