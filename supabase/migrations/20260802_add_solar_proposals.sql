create table if not exists public.solar_proposals (
  id uuid primary key default gen_random_uuid(),
  proposal_reference text not null unique,
  lead_id uuid references public.leads(id) on delete set null,
  postcode text not null,
  address text not null,
  input_json jsonb not null default '{}'::jsonb,
  calculation_json jsonb not null default '{}'::jsonb,
  status text not null default 'generated',
  pdf_url text,
  created_at timestamptz not null default now()
);

create index if not exists solar_proposals_lead_id_idx on public.solar_proposals (lead_id);
create index if not exists solar_proposals_created_at_idx on public.solar_proposals (created_at desc);
