-- Run this query in the Supabase SQL Editor to add the Emergency flag

ALTER TABLE files ADD COLUMN is_emergency BOOLEAN DEFAULT false;
