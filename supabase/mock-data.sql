-- Mock data derived from the project codebase.
-- This extends the base seed with the operational tables that were missing from `seed.sql`.
-- Run with `psql` or `supabase db reset`; the Supabase SQL editor does not support `\i`.

\i seed.sql

with installer_ids as (
  select id, slug
  from public.installers
),
territory_ids as (
  select id, slug
  from public.territories
)
insert into public.documents (installer_id, document_type, file_url, verified, uploaded_at)
select installer_ids.id, 'mcs-certificate', 'https://example.com/documents/' || installer_ids.slug || '/mcs-certificate.pdf', true, now() - interval '10 days'
from installer_ids
where installer_ids.slug in ('cambrian-eco-heat', 'valley-renewables-group', 'northline-heat-partners', 'mercia-home-energy', 'thames-clean-heat', 'caledonia-heatworks')
union all
select installer_ids.id, 'insurance-certificate', 'https://example.com/documents/' || installer_ids.slug || '/insurance-certificate.pdf', false, now() - interval '7 days'
from installer_ids
where installer_ids.slug in ('cambrian-eco-heat', 'valley-renewables-group', 'thames-clean-heat')
union all
select installer_ids.id, 'company-profile', 'https://example.com/documents/' || installer_ids.slug || '/company-profile.pdf', true, now() - interval '5 days'
from installer_ids
where installer_ids.slug in ('northline-heat-partners', 'mercia-home-energy', 'caledonia-heatworks');

insert into public.territory_requests (installer_id, territory_id, notes, status, requested_at)
select i.id, t.id, 'Requesting additional campaign coverage for the current quarter.', 'pending', now() - interval '3 days'
from installer_ids i
join territory_ids t on t.slug = 'south-west-england'
where i.slug = 'cambrian-eco-heat'
union all
select i.id, t.id, 'Approved for overflow coverage while existing slot capacity is reviewed.', 'approved', now() - interval '12 days'
from installer_ids i
join territory_ids t on t.slug = 'yorkshire'
where i.slug = 'northline-heat-partners'
union all
select i.id, t.id, 'Expanding London availability after recent staffing changes.', 'rejected', now() - interval '1 day'
from installer_ids i
join territory_ids t on t.slug = 'london'
where i.slug = 'caledonia-heatworks';

insert into public.notification_outbox (event_type, channel, recipient_email, recipient_role, subject, body, payload, status, created_at, sent_at)
values
('lead.received', 'email', 'hello@cambrian.example', 'installer', 'New lead assigned', 'A new homeowner lead was assigned to your team.', '{"leadId":"lead-1","installerSlug":"cambrian-eco-heat"}', 'queued', now() - interval '2 hours', null),
('lead.received', 'email', 'admin@example.com', 'admin', 'New lead captured', 'A homeowner lead was captured from the directory.', '{"leadId":"lead-1"}', 'sent', now() - interval '1 day', now() - interval '1 day' + interval '3 minutes'),
('application.received', 'email', 'admin@example.com', 'admin', 'New installer application', 'A new installer application is waiting for review.', '{"applicationId":"application-1"}', 'queued', now() - interval '6 hours', null),
('installer.approved', 'email', 'hello@valley.example', 'installer', 'Application approved', 'Your installer application has been approved.', '{"installerSlug":"valley-renewables-group"}', 'sent', now() - interval '4 days', now() - interval '4 days' + interval '4 minutes'),
('payment.failed', 'email', 'billing@thames.example', 'installer', 'Payment failed', 'A subscription payment failed and needs attention.', '{"installerSlug":"thames-clean-heat"}', 'failed', now() - interval '18 hours', null);

insert into public.audit_logs (actor_role, action, entity_type, entity_id, payload, created_at)
select 'admin', 'seed.imported', 'territory', t.id, jsonb_build_object('slug', t.slug, 'source', 'lib/data.ts'), now() - interval '20 days'
from public.territories t
union all
select 'admin', 'seed.imported', 'installer', i.id, jsonb_build_object('slug', i.slug, 'source', 'lib/data.ts'), now() - interval '20 days'
from public.installers i
union all
select 'admin', 'seed.imported', 'lead', l.id, jsonb_build_object('stage', l.stage, 'source', 'lib/data.ts'), now() - interval '20 days'
from public.leads l
where l.id in ('lead-1', 'lead-2', 'lead-3', 'lead-4', 'lead-5');
