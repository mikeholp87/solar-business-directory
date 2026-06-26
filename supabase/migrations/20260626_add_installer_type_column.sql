-- Add 'type' column to installers for sorting/filtering on directory.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS type text;

-- Populate type from the first element of the services array
UPDATE public.installers
SET type = CASE
  WHEN jsonb_typeof(services) = 'array' AND jsonb_array_length(services) > 0 THEN services->>0
  ELSE 'General'
END
WHERE type IS NULL;
