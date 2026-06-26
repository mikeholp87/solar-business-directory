-- Add 'type' column to installers for sorting/filtering on directory.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS type text;

-- Populate type from the first element of the services array
UPDATE public.installers
SET type = services->>0
WHERE type IS NULL AND jsonb_array_length(services) > 0;

-- Set default for any remaining nulls
UPDATE public.installers
SET type = 'General'
WHERE type IS NULL;
