# Analytics Setup Guide

## Overview
This guide will help you set up the comprehensive analytics system for your single-page app development agency website.

## What's Been Implemented

### 1. Database Schema
- **analytics_events**: Tracks all user interactions (clicks, form submissions, video plays)
- **analytics_section_views**: Tracks when users view different sections
- **analytics_scroll_depth**: Tracks how far users scroll (25%, 50%, 75%, 100%)

### 2. Tracked Events

#### CTA Clicks
- "View Our Work" button
- "Get In Touch" button in hero

#### Portfolio Interactions
- Portfolio item clicks
- Video plays in modal

#### Contact Interactions
- WhatsApp clicks
- Phone clicks
- Email clicks
- Send message button clicks
- Form submissions (main conversion event)

#### Section Views
- Hero
- Portfolio
- Testimonials
- Team
- Contact (Free Quotation)

#### Scroll Depth
- 25%, 50%, 75%, 100% milestones

### 3. Admin Dashboard Features

#### Tabs:
1. **Overview**: Key metrics and top clicked elements
2. **Conversion Funnel**: Hero → Portfolio → Contact → Form Submit
3. **User Events**: All tracked events with counts
4. **Section Views**: Time spent in each section
5. **Scroll Depth**: How far users scroll
6. **Messages**: Contact form submissions
7. **Visitors**: Site visitors

## Setup Instructions

### Step 1: Run the SQL Schema
1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Open `supabase-analytics-schema.sql`
4. Copy and paste the entire contents
5. Click "Run" to create all tables, indexes, and views

### Step 2: Verify Installation
1. Check that these tables exist in your database:
   - `analytics_events`
   - `analytics_section_views`
   - `analytics_scroll_depth`
2. Check that the existing tables are still there:
   - `visitors`
   - `messages`

### Step 3: Deploy Your Website
1. Make sure all files are uploaded:
   - `index.html` (updated with analytics script)
   - `analytics.js` (new tracking system)
   - `admin.html` (updated dashboard)
   - `script.js` (existing)
   - `supabase-config.js` (existing)

### Step 4: Test the Tracking
1. Visit your website: `index.html`
2. Navigate through different sections
3. Click on various buttons
4. Scroll to different depths
5. Submit a test contact form

### Step 5: View Analytics
1. Open the admin dashboard: `admin.html`
2. Navigate through the different tabs
3. You should see data populate as users interact with your site

## Data Flow

```
User Action → analytics.js → Supabase → admin.html Dashboard
```

1. **User interacts** with the website (clicks, scrolls, views sections)
2. **analytics.js** captures the event
3. **Event is sent** to Supabase tables
4. **Admin dashboard** queries and displays the data

## Key Features

### Event-Based Tracking
All tracking is event-based and tied to the same `visitor_id` used for tracking visitors and messages.

### Conversion Funnel
Track the complete user journey:
- **Step 1**: Land on hero section (100%)
- **Step 2**: View portfolio section (X% conversion)
- **Step 3**: Reach contact section (Y% conversion)
- **Step 4**: Submit form (Z% conversion - MAIN CONVERSION)

### Real-Time Updates
The admin dashboard auto-refreshes every 30 seconds to show the latest data.

### No Vanity Metrics
We focus on actionable metrics:
- ✅ Section views
- ✅ CTA clicks
- ✅ Contact interactions
- ✅ Form submissions
- ✅ Scroll depth
- ❌ Time on page (not tracked)
- ❌ Bounce rate (not tracked)
- ❌ Navbar clicks (not tracked)

## Troubleshooting

### No Data Showing
1. Check browser console for errors
2. Verify Supabase tables were created
3. Ensure `analytics.js` is loaded before `script.js` in `index.html`
4. Check that Supabase credentials are correct in `supabase-config.js`

### Events Not Being Tracked
1. Open browser console on your main site
2. Look for "Analytics initialized" message
3. Check for any error messages
4. Verify that Supabase tables have insert permissions (RLS policies)

### Admin Dashboard Not Loading
1. Check browser console for errors
2. Verify you're connected to Supabase
3. Ensure all tables exist in the database
4. Try refreshing the page

## Privacy & Performance

### Privacy
- No personal identifying information is collected beyond what users voluntarily provide in the contact form
- Visitor IDs are randomly generated and stored in session storage
- IP addresses are collected via third-party service (ipapi.co) for location data

### Performance
- Tracking is lightweight and non-blocking
- Events are batched to minimize database calls
- Uses Intersection Observer for efficient section tracking
- Throttled scroll tracking to avoid performance issues

## Next Steps

### Analyze Your Data
1. Monitor the conversion funnel to see where users drop off
2. Check which portfolio items get the most engagement
3. See which CTAs drive the most contact interactions
4. Analyze scroll depth to optimize content placement

### Optimize Based on Insights
1. If users don't scroll to 75%, consider moving important content higher
2. If portfolio → contact conversion is low, add CTAs in portfolio section
3. If contact → form conversion is low, simplify the form
4. If certain portfolio items get high engagement, feature them more prominently

### Set Goals
- Target form submission conversion rate: X%
- Target portfolio engagement rate: Y%
- Target scroll depth: Z% of users reach 75%

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify all SQL tables were created successfully
3. Ensure Row Level Security policies allow insert and select operations
4. Check that the Supabase anon key has the necessary permissions

---

**Important**: Remember to run the SQL schema in your Supabase database before testing the tracking!
