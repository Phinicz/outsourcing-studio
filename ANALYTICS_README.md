# Analytics Setup with Supabase

This guide will help you set up analytics tracking for your portfolio website using Supabase.

## 🚀 Quick Start (3 Steps)

### Step 1: Get Your Supabase Anon Key

1. Go to [Supabase API Settings](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/settings/api)
2. Find **"Project API keys"** section
3. Copy the **"anon public"** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 2: Create Database Tables

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/sql/new)
2. Open the file `supabase-schema.sql` from your project
3. Copy all the SQL code and paste it into the SQL Editor
4. Click **"Run"** button

### Step 3: Update Configuration

1. Open `supabase-config.js`
2. Find this line:
   ```javascript
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bWZmeXhmcXhhcGJycm1wZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3Mzk5NzksImV4cCI6MjA1MTMxNTk3OX0.placeholder';
   ```
3. Replace `placeholder` at the end with your actual anon key from Step 1

## ✅ Test Your Setup

### Option 1: Quick Test (Recommended)
1. Open `tmp_rovodev_test_supabase.html` in your browser
2. Update the `SUPABASE_ANON_KEY` in that file
3. Refresh the page - it will test your connection and tables

### Option 2: Full Test
1. Deploy your website or open `index.html` locally
2. The page should automatically track your visit
3. Fill out the contact form and submit a message
4. Open `admin.html` to see the analytics dashboard
5. You should see your visit and message with location data

## 📊 What Gets Tracked

### Visitor Analytics
- **Unique Visitor ID** - Session-based identifier
- **Timestamp** - When they visited
- **Location** - Country, City, Region (from IP)
- **IP Address** - Visitor's IP
- **Page** - Which page they visited
- **User Agent** - Browser and device info

### Message Analytics
- **Name & Email** - From contact form
- **Message Content** - Their message
- **Timestamp** - When sent
- **Location** - Country, City, Region, IP of sender
- **Visitor ID** - Links message to visitor

## 🎯 Admin Dashboard Features

Access at: `admin.html`

The dashboard shows:
- **Current Visitors** - Active in the last hour
- **Total Messages** - All messages received
- **Total Visitors** - All tracked visitors
- **Recent Messages** - Last 20 messages with full details
- **Recent Visitors** - Last 30 visitors with location info

Auto-refreshes every 30 seconds!

## 🔧 How It Works

### Architecture
```
Website Visitor
    ↓
JavaScript Detects Visit
    ↓
Get Location (IP Geolocation API)
    ↓
Save to Supabase Database
    ↓
Admin Dashboard Displays Data
```

### Files Added/Modified

**New Files:**
- `supabase-config.js` - Supabase client configuration
- `supabase-schema.sql` - Database table definitions
- `tmp_rovodev_test_supabase.html` - Connection test page
- `ANALYTICS_README.md` - This file

**Modified Files:**
- `index.html` - Added Supabase scripts
- `admin.html` - Updated to fetch from Supabase
- `script.js` - Added Supabase saving for visitors and messages

### Database Schema

**visitors table:**
```sql
- id (UUID, Primary Key)
- visitor_id (Text)
- timestamp (Timestamp)
- page (Text)
- user_agent (Text)
- country (Text)
- city (Text)
- region (Text)
- ip (Text)
- created_at (Timestamp)
```

**messages table:**
```sql
- id (UUID, Primary Key)
- visitor_id (Text)
- name (Text)
- email (Text)
- message (Text)
- timestamp (Timestamp)
- country (Text)
- city (Text)
- region (Text)
- ip (Text)
- created_at (Timestamp)
```

## 🛡️ Security

- Row Level Security (RLS) is enabled
- Public can INSERT data (for tracking)
- Public can READ data (for admin dashboard)
- No UPDATE or DELETE permissions for public
- Anon key is safe to expose in frontend code

## 🔍 Troubleshooting

### "Connection Failed"
- Check your anon key is correct
- Verify you're connected to internet
- Check browser console for errors

### "Tables Not Found"
- Make sure you ran the SQL schema in Supabase
- Go to [Table Editor](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor) and verify `visitors` and `messages` tables exist

### "No Data Showing"
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify data is in Supabase Table Editor
- Try clicking "Refresh Data" button

### Data Not Saving
- Check browser console for "saved successfully" messages
- If you see fallback messages, check Supabase connection
- Verify RLS policies are set correctly

## 📱 Browser Compatibility

Works with:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

Requires:
- JavaScript enabled
- LocalStorage enabled (for fallback)

## 🌍 Location Data

Location is obtained from:
1. Primary: `ipapi.co` free API
2. Fallback: Browser timezone detection
3. Last resort: "Unknown" values

No personal data beyond IP address is collected.

## 📈 Viewing Data in Supabase

1. Go to [Table Editor](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor)
2. Click `visitors` or `messages` table
3. See all data with filters and search
4. Export to CSV if needed

## 🎨 Customization

### Change Tracking Limits
In `admin.html`, modify these lines:
```javascript
.limit(20); // For messages
.limit(30); // For visitors
```

### Change Refresh Interval
In `admin.html`, find:
```javascript
setInterval(refreshData, 30000); // 30 seconds
```

### Add More Fields
1. Add column in Supabase Table Editor
2. Update `script.js` to include new field
3. Update `admin.html` to display it

## 💡 Tips

- Check admin dashboard regularly for messages
- Export data periodically for backup
- Monitor current visitors to see traffic patterns
- Use location data to understand your audience
- Keep your anon key safe (though it's public-safe)

## 🆘 Need Help?

If something isn't working:
1. Run `tmp_rovodev_test_supabase.html` first
2. Check browser console for errors
3. Verify Supabase dashboard shows tables
4. Check this README for troubleshooting steps

---

**Your Supabase Project:** `vxmffyxfqxapbrrmpfhd`  
**Dashboard:** https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd
