-- Add missing installer fields from the MCS JSON data.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS mcs_installer_id integer;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS address_line1 text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS address_line2 text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS address_line3 text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS address_county text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS address_postcode text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS address_country text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS certification_body text;
ALTER TABLE public.installers ADD COLUMN IF NOT EXISTS source_page integer;
