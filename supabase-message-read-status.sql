-- Add read/unread functionality to messages table
-- Run this in your Supabase SQL Editor

-- Add is_read column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Add read_at timestamp column
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

-- Create index for faster queries on unread messages
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- Create policy for updating read status (anyone can mark as read)
CREATE POLICY "Enable update for all users" ON messages
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Optional: Create a view for unread message count
CREATE OR REPLACE VIEW message_unread_count AS
SELECT 
  COUNT(*) as unread_count
FROM messages
WHERE is_read = FALSE;

-- Optional: Create a view for read vs unread stats
CREATE OR REPLACE VIEW message_read_stats AS
SELECT 
  COUNT(*) as total_messages,
  COUNT(CASE WHEN is_read = TRUE THEN 1 END) as read_messages,
  COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_messages,
  ROUND(
    COUNT(CASE WHEN is_read = TRUE THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as read_percentage
FROM messages;
