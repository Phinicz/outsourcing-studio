-- Analytics Schema for Single-Page App Tracking
-- Run this in your Supabase SQL Editor

-- Table for tracking user events (clicks, interactions)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'click', 'form_submit', 'video_play', etc.
  event_category TEXT NOT NULL, -- 'cta', 'portfolio', 'contact', etc.
  event_label TEXT, -- specific identifier (e.g., 'portfolio_item_arcania', 'whatsapp_click')
  event_value TEXT, -- additional data (e.g., video_id, button_text)
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for tracking section views
CREATE TABLE IF NOT EXISTS analytics_section_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  section_name TEXT NOT NULL, -- 'hero', 'portfolio', 'testimonials', 'team', 'contact'
  view_duration INTEGER, -- time spent in section (seconds)
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for tracking scroll depth
CREATE TABLE IF NOT EXISTS analytics_scroll_depth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  depth_percentage INTEGER NOT NULL, -- 25, 50, 75, 100
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id ON analytics_events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events(event_category);

CREATE INDEX IF NOT EXISTS idx_analytics_section_views_visitor_id ON analytics_section_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_section_views_timestamp ON analytics_section_views(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_section_views_section ON analytics_section_views(section_name);

CREATE INDEX IF NOT EXISTS idx_analytics_scroll_depth_visitor_id ON analytics_scroll_depth(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_scroll_depth_timestamp ON analytics_scroll_depth(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_scroll_depth_percentage ON analytics_scroll_depth(depth_percentage);

-- Enable Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_section_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_scroll_depth ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert access
CREATE POLICY "Enable insert for all users" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON analytics_section_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON analytics_scroll_depth
  FOR INSERT WITH CHECK (true);

-- Create policies for read access
CREATE POLICY "Enable read access for all users" ON analytics_events
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON analytics_section_views
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON analytics_scroll_depth
  FOR SELECT USING (true);

-- View: Event summary statistics
CREATE OR REPLACE VIEW analytics_event_stats AS
SELECT 
  event_category,
  event_type,
  event_label,
  COUNT(*) as event_count,
  COUNT(DISTINCT visitor_id) as unique_users
FROM analytics_events
GROUP BY event_category, event_type, event_label
ORDER BY event_count DESC;

-- View: Section view statistics
CREATE OR REPLACE VIEW analytics_section_stats AS
SELECT 
  section_name,
  COUNT(*) as total_views,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  AVG(view_duration) as avg_duration_seconds
FROM analytics_section_views
GROUP BY section_name
ORDER BY total_views DESC;

-- View: Conversion funnel (hero -> portfolio -> contact -> form submit)
CREATE OR REPLACE VIEW analytics_conversion_funnel AS
WITH section_viewers AS (
  SELECT DISTINCT visitor_id, section_name
  FROM analytics_section_views
),
hero_viewers AS (
  SELECT COUNT(DISTINCT visitor_id) as total_visitors
  FROM section_viewers
  WHERE section_name = 'hero'
),
portfolio_viewers AS (
  SELECT COUNT(DISTINCT visitor_id) as portfolio_views
  FROM section_viewers
  WHERE section_name = 'portfolio'
),
contact_viewers AS (
  SELECT COUNT(DISTINCT visitor_id) as contact_views
  FROM section_viewers
  WHERE section_name = 'contact'
),
form_submitters AS (
  SELECT COUNT(DISTINCT visitor_id) as form_submissions
  FROM analytics_events
  WHERE event_type = 'form_submit' AND event_category = 'contact'
)
SELECT 
  (SELECT total_visitors FROM hero_viewers) as step1_hero,
  (SELECT portfolio_views FROM portfolio_viewers) as step2_portfolio,
  (SELECT contact_views FROM contact_viewers) as step3_contact,
  (SELECT form_submissions FROM form_submitters) as step4_form_submit,
  ROUND(
    (SELECT portfolio_views FROM portfolio_viewers)::numeric / 
    NULLIF((SELECT total_visitors FROM hero_viewers), 0) * 100, 
    2
  ) as portfolio_conversion_rate,
  ROUND(
    (SELECT contact_views FROM contact_viewers)::numeric / 
    NULLIF((SELECT portfolio_views FROM portfolio_viewers), 0) * 100, 
    2
  ) as contact_conversion_rate,
  ROUND(
    (SELECT form_submissions FROM form_submitters)::numeric / 
    NULLIF((SELECT contact_views FROM contact_viewers), 0) * 100, 
    2
  ) as form_conversion_rate;

-- View: Scroll depth distribution
CREATE OR REPLACE VIEW analytics_scroll_stats AS
SELECT 
  depth_percentage,
  COUNT(*) as total_reaches,
  COUNT(DISTINCT visitor_id) as unique_visitors,
  ROUND(
    COUNT(DISTINCT visitor_id)::numeric / 
    (SELECT COUNT(DISTINCT visitor_id) FROM analytics_scroll_depth) * 100,
    2
  ) as percentage_of_visitors
FROM analytics_scroll_depth
GROUP BY depth_percentage
ORDER BY depth_percentage;

-- View: Most clicked elements
CREATE OR REPLACE VIEW analytics_top_clicks AS
SELECT 
  event_label,
  event_category,
  COUNT(*) as click_count,
  COUNT(DISTINCT visitor_id) as unique_clickers
FROM analytics_events
WHERE event_type = 'click'
GROUP BY event_label, event_category
ORDER BY click_count DESC
LIMIT 20;

-- View: Recent analytics overview (last 24 hours)
CREATE OR REPLACE VIEW analytics_recent_overview AS
WITH recent_timeframe AS (
  SELECT NOW() - INTERVAL '24 hours' as cutoff_time
)
SELECT 
  (SELECT COUNT(DISTINCT visitor_id) FROM visitors WHERE timestamp > (SELECT cutoff_time FROM recent_timeframe)) as unique_visitors_24h,
  (SELECT COUNT(*) FROM analytics_events WHERE timestamp > (SELECT cutoff_time FROM recent_timeframe)) as total_events_24h,
  (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'click' AND event_category = 'cta' AND timestamp > (SELECT cutoff_time FROM recent_timeframe)) as cta_clicks_24h,
  (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'form_submit' AND timestamp > (SELECT cutoff_time FROM recent_timeframe)) as form_submissions_24h,
  (SELECT COUNT(DISTINCT visitor_id) FROM analytics_section_views WHERE section_name = 'portfolio' AND timestamp > (SELECT cutoff_time FROM recent_timeframe)) as portfolio_viewers_24h;
