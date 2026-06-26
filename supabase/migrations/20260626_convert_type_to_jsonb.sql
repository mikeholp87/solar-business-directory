-- Change 'type' column from text to jsonb array.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

-- Add new jsonb column
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS type_new jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Copy existing text values into array format
UPDATE public.installers
SET type_new = CASE
  WHEN type IS NOT NULL THEN jsonb_build_array(type)
  ELSE '[]'::jsonb
END;

-- Drop old column and rename new one
ALTER TABLE public.installers DROP COLUMN IF EXISTS type;
ALTER TABLE public.installers RENAME COLUMN type_new TO type;
