# 🚀 Analytics Setup - Start Here!

## Quick 5-Minute Setup

Follow these steps **in order** to get your analytics working:

---

## ✅ Step 1: Get Your Supabase Anon Key (2 minutes)

1. **Click this link:** [Get Anon Key](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/settings/api)
2. Find the section **"Project API keys"**
3. Copy the **"anon" "public"** key (it's a long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

## ✅ Step 2: Setup Database Tables (2 minutes)

1. **Click this link:** [Open SQL Editor](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/sql/new)
2. Open the file `supabase-schema.sql` in your project folder
3. Copy **ALL** the SQL code (Ctrl+A, Ctrl+C)
4. Paste it into the SQL Editor
5. Click the **"Run"** button (bottom right)
6. Wait for "Success. No rows returned" message

---

## ✅ Step 3: Update Configuration (1 minute)

1. Open the file `supabase-config.js`
2. Find line 2:
   ```javascript
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bWZmeXhmcXhhcGJycm1wZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3Mzk5NzksImV4cCI6MjA1MTMxNTk3OX0.placeholder';
   ```
3. Replace **EVERYTHING after the last period** (replace `placeholder`) with your anon key from Step 1
4. Save the file

**Example:**
```javascript
// Before:
const SUPABASE_ANON_KEY = '...eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bWZmeXhmcXhhcGJycm1wZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3Mzk5NzksImV4cCI6MjA1MTMxNTk3OX0.placeholder';

// After:
const SUPABASE_ANON_KEY = '...eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4bWZmeXhmcXhhcGJycm1wZmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3Mzk5NzksImV4cCI6MjA1MTMxNTk3OX0.YOUR_ACTUAL_KEY_HERE';
```

---

## 🧪 Step 4: Test Everything (Optional but Recommended)

1. Open `tmp_rovodev_quick_test.html` in your browser
2. Update the anon key in that file too (same as step 3)
3. Click each test button in order
4. All should show ✅ green checkmarks

---

## 🎉 Step 5: Use Your Analytics!

### Test the Main Site:
1. Open `index.html` in your browser
2. Your visit is automatically tracked!
3. Fill out the contact form and send a message
4. Open `admin.html` to see your analytics dashboard

### View in Supabase:
- [View Visitors Table](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor?table=visitors)
- [View Messages Table](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor?table=messages)

---

## 📊 What You'll See

### Admin Dashboard (`admin.html`) Shows:

✨ **Stats Cards:**
- Current Visitors (active in last hour)
- Total Messages received
- Total Visitors tracked

📧 **Recent Messages:**
- Sender name & email
- Message content
- Location (Country, City, Region)
- IP address
- Visitor ID
- Timestamp

👥 **Recent Visitors:**
- Visitor ID
- Visit time
- Location data
- Page visited
- IP address

🔄 **Auto-refreshes every 30 seconds!**

---

## 🎯 What Gets Tracked

### Every Visitor:
- ✅ Unique session ID
- ✅ Country, City, Region
- ✅ IP address
- ✅ Page visited
- ✅ Timestamp
- ✅ Browser info

### Every Message:
- ✅ Name & Email
- ✅ Message content
- ✅ Location of sender
- ✅ IP address
- ✅ Timestamp
- ✅ Links to visitor

---

## 🆘 Troubleshooting

### "No data showing in admin"
- Check browser console (F12) for errors
- Verify you completed all 3 setup steps
- Try the test page (`tmp_rovodev_quick_test.html`)

### "Connection failed"
- Double-check your anon key is correct
- Make sure you're connected to internet
- Verify no typos in `supabase-config.js`

### "Tables not found"
- Go back to Step 2
- Make sure SQL script ran successfully
- Check [Table Editor](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor) shows both tables

---

## 📚 Additional Resources

- **Detailed Guide:** See `ANALYTICS_README.md`
- **Database Schema:** See `supabase-schema.sql`
- **Quick Test:** Open `tmp_rovodev_quick_test.html`

---

## 🔒 Security Note

The anon key is **safe to expose** in your frontend code. It only allows:
- ✅ Adding new visitors/messages
- ✅ Reading data (for admin dashboard)
- ❌ NO editing or deleting data

Row Level Security (RLS) protects your database!

---

## ✨ That's It!

You now have:
- ✅ Visitor tracking with location
- ✅ Message storage with sender location
- ✅ Real-time analytics dashboard
- ✅ Automatic data backup in Supabase

**Need more help?** Check the browser console (F12) for detailed error messages.

---

**Your Project:** `vxmffyxfqxapbrrmpfhd`  
**Dashboard:** https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd
