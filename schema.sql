-- Run this SQL in your Supabase SQL Editor to create the files table and secure it!

CREATE TABLE files (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  "originalName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  size BIGINT NOT NULL,
  "uploadDate" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for maximum security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies so users can only access their own files
CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = user_id);
