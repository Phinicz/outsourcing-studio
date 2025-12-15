# 🎯 Analytics Quick Reference

## 🚀 3-Step Setup

1. **Get Anon Key:** https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/settings/api
2. **Run SQL:** https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/sql/new (paste `supabase-schema.sql`)
3. **Update:** `supabase-config.js` line 2 - replace `placeholder` with your key

## 🧪 Test

- **Quick Test:** Open `tmp_rovodev_quick_test.html` (update key first)
- **Full Test:** Open `index.html` → submit form → check `admin.html`

## 📊 View Data

- **Dashboard:** `admin.html` (auto-refreshes every 30s)
- **Supabase Tables:** 
  - [Visitors](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor?table=visitors)
  - [Messages](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/editor?table=messages)

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| No data in admin | Check browser console (F12) |
| Connection failed | Verify anon key in `supabase-config.js` |
| Tables not found | Run `supabase-schema.sql` in SQL Editor |
| Location shows "Unknown" | Check internet connection |

## 📝 What's Tracked

**Visitors:** ID, Location (Country/City/Region), IP, Page, Time, Browser  
**Messages:** Name, Email, Message, Location, IP, Time, Visitor ID

## 🆘 Get Help

- **Browser Console:** F12 → Console tab (see errors)
- **Supabase Logs:** [View Logs](https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd/logs/edge-logs)
- **Detailed Docs:** See `ANALYTICS_README.md`

## ✨ Important Files

- `supabase-config.js` - Your configuration (UPDATE THIS!)
- `supabase-schema.sql` - Database tables (RUN THIS!)
- `admin.html` - Analytics dashboard
- `index.html` - Main site (tracks visitors)
- `script.js` - Tracking logic

---

**Project ID:** `vxmffyxfqxapbrrmpfhd`  
**Dashboard:** https://supabase.com/dashboard/project/vxmffyxfqxapbrrmpfhd
