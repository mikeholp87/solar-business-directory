-- One-shot bootstrap script for the current application state.
-- Use this with `psql` or `supabase db reset`; the Supabase SQL editor does not support `\i`.

begin;
\i schema.sql
\i mock-data.sql
commit;
