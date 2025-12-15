-- Supabase Database Schema for Analytics
-- Run this in your Supabase SQL Editor

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  page TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on visitor_id for faster queries
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id ON visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_timestamp ON visitors(timestamp DESC);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  country TEXT,
  city TEXT,
  region TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_visitor_id ON messages(visitor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert access (anyone can add visitors/messages)
CREATE POLICY "Enable insert for all users" ON visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for all users" ON messages
  FOR INSERT WITH CHECK (true);

-- Create policies for read access (anyone can read)
CREATE POLICY "Enable read access for all users" ON visitors
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON messages
  FOR SELECT USING (true);

-- Optional: Create a view for visitor analytics
CREATE OR REPLACE VIEW visitor_stats AS
SELECT 
  COUNT(DISTINCT visitor_id) as unique_visitors,
  COUNT(*) as total_visits,
  COUNT(DISTINCT CASE WHEN timestamp > NOW() - INTERVAL '1 hour' THEN visitor_id END) as current_visitors
FROM visitors;

-- Optional: Create a view for message stats
CREATE OR REPLACE VIEW message_stats AS
SELECT 
  COUNT(*) as total_messages,
  COUNT(DISTINCT visitor_id) as unique_senders
FROM messages;
