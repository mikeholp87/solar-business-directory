create extension if not exists pgcrypto;

create type user_role as enum ('admin', 'installer');
create type installer_status as enum ('pending', 'approved', 'active', 'suspended', 'cancelled');
create type subscription_status as enum ('trialing', 'active', 'past_due', 'offline_active', 'cancelled');
create type territory_status as enum ('available', 'limited', 'full', 'priority');
create type lead_stage as enum (
  'new_enquiry',
  'contacted',
  'qualified',
  'survey_booked',
  'survey_completed',
  'quote_issued',
  'bus_application_submitted',
  'bus_accepted',
  'installation_booked',
  'installation_completed',
  'lost',
  'not_eligible'
);
create type fee_type as enum ('monthly_directory', 'pay_per_lead', 'pay_per_install', 'hybrid');
create type invoice_status as enum ('not_invoiced', 'draft', 'sent', 'paid', 'overdue');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role user_role not null default 'installer',
  created_at timestamptz not null default now()
);

create table public.territories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  region text not null,
  counties jsonb not null default '[]'::jsonb,
  postcode_prefixes jsonb not null default '[]'::jsonb,
  max_installer_slots integer not null default 3,
  status territory_status not null default 'available',
  priority boolean not null default false,
  lead_volume integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.installers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  company_name text not null,
  slug text not null unique,
  contact_name text,
  email text not null,
  phone text,
  website text,
  company_number text,
  vat_number text,
  logo_url text,
  cover_image_url text,
  description text,
  mcs_number text,
  bus_registered boolean not null default false,
  accreditations_verified boolean not null default false,
  recc_number text,
  hies_number text,
  trustmark_number text,
  services jsonb not null default '[]'::jsonb,
  areas_covered jsonb not null default '[]'::jsonb,
  monthly_install_capacity integer,
  survey_turnaround_days integer,
  status installer_status not null default 'pending',
  subscription_status subscription_status not null default 'trialing',
  stripe_customer_id text,
  stripe_subscription_id text,
  lead_price numeric(10,2),
  installer_fee_type fee_type default 'monthly_directory',
  referral_fee_total numeric(10,2) not null default 1250,
  bus_acceptance_fee numeric(10,2) not null default 250,
  completion_fee numeric(10,2) not null default 1000,
  vat_applicable boolean not null default true,
  maximum_monthly_lead_allocation integer,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.installer_territories (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references public.installers(id) on delete cascade,
  territory_id uuid not null references public.territories(id) on delete cascade,
  status installer_status not null default 'pending',
  admin_override boolean not null default false,
  created_at timestamptz not null default now(),
  unique (installer_id, territory_id)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  postcode text not null,
  address text,
  homeowner_status boolean not null default false,
  current_heating_source text,
  monthly_bill text,
  property_type text,
  bedrooms integer,
  interests jsonb not null default '[]'::jsonb,
  consent_contact boolean not null default false,
  consent_marketing boolean not null default false,
  gdpr_acceptance boolean not null default true,
  territory_id uuid references public.territories(id),
  preferred_installer_id uuid references public.installers(id),
  assigned_installer_id uuid references public.installers(id),
  source text,
  campaign text,
  stage lead_stage not null default 'new_enquiry',
  survey_date date,
  bus_application_date date,
  bus_acceptance_date date,
  install_date date,
  completion_date date,
  lead_value numeric(10,2),
  lead_cost numeric(10,2),
  referral_fee_due numeric(10,2) default 0,
  referral_fee_paid boolean not null default false,
  bus_acceptance_payment_due numeric(10,2) default 250,
  completion_payment_due numeric(10,2) default 1000,
  vat_applicable boolean not null default true,
  invoice_status invoice_status not null default 'not_invoiced',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.installer_applications (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  website text,
  company_number text,
  vat_number text,
  mcs_number text,
  bus_registered boolean default false,
  recc_number text,
  hies_number text,
  trustmark_number text,
  services jsonb not null default '[]'::jsonb,
  areas_covered jsonb not null default '[]'::jsonb,
  preferred_territories jsonb not null default '[]'::jsonb,
  monthly_install_capacity integer,
  survey_turnaround_days integer,
  handles_bus_applications boolean default false,
  completes_heat_loss_calculations boolean default false,
  offers_solar boolean default false,
  offers_battery boolean default false,
  open_to_monthly_listing boolean default false,
  open_to_pay_per_install boolean default false,
  notes text,
  status installer_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references public.installers(id) on delete cascade,
  document_type text not null,
  file_url text not null,
  verified boolean not null default false,
  uploaded_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references public.installers(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin')
$$;

create or replace function public.prevent_territory_overfill()
returns trigger
language plpgsql
as $$
declare
  active_count integer;
  slot_limit integer;
begin
  if new.status <> 'active' or new.admin_override then
    return new;
  end if;

  select count(*)
  into active_count
  from public.installer_territories
  where territory_id = new.territory_id
    and status = 'active'
    and id <> coalesce(new.id, gen_random_uuid());

  select max_installer_slots into slot_limit from public.territories where id = new.territory_id;

  if active_count >= slot_limit then
    raise exception 'Territory installer slot limit reached';
  end if;

  return new;
end;
$$;

create trigger enforce_territory_slot_limit
before insert or update on public.installer_territories
for each row execute function public.prevent_territory_overfill();

create or replace function public.prevent_installer_commercial_self_edit()
returns trigger
language plpgsql
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if old.user_id = auth.uid() then
    if new.status is distinct from old.status
      or new.subscription_status is distinct from old.subscription_status
      or new.stripe_customer_id is distinct from old.stripe_customer_id
      or new.stripe_subscription_id is distinct from old.stripe_subscription_id
      or new.lead_price is distinct from old.lead_price
      or new.installer_fee_type is distinct from old.installer_fee_type
      or new.referral_fee_total is distinct from old.referral_fee_total
      or new.bus_acceptance_fee is distinct from old.bus_acceptance_fee
      or new.completion_fee is distinct from old.completion_fee
      or new.vat_applicable is distinct from old.vat_applicable
      or new.maximum_monthly_lead_allocation is distinct from old.maximum_monthly_lead_allocation
      or new.internal_notes is distinct from old.internal_notes
      or new.accreditations_verified is distinct from old.accreditations_verified
    then
      raise exception 'Installer users cannot update admin-only commercial fields';
    end if;
  end if;

  return new;
end;
$$;

create trigger protect_installer_commercial_fields
before update on public.installers
for each row execute function public.prevent_installer_commercial_self_edit();

alter table public.users enable row level security;
alter table public.installers enable row level security;
alter table public.territories enable row level security;
alter table public.installer_territories enable row level security;
alter table public.leads enable row level security;
alter table public.installer_applications enable row level security;
alter table public.documents enable row level security;
alter table public.reviews enable row level security;

create policy "public can read live territories" on public.territories for select using (true);
create policy "admins manage territories" on public.territories for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read active installers" on public.installers for select using (status = 'active' and accreditations_verified = true);
create policy "installers read own profile" on public.installers for select using (user_id = auth.uid());
create policy "installers update own non-commercial profile" on public.installers for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "admins manage installers" on public.installers for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read active installer territory links" on public.installer_territories for select using (status = 'active');
create policy "admins manage installer territories" on public.installer_territories for all using (public.is_admin()) with check (public.is_admin());

create policy "public can submit leads" on public.leads for insert with check (consent_contact = true and gdpr_acceptance = true);
create policy "installers read assigned leads" on public.leads for select using (
  assigned_installer_id in (select id from public.installers where user_id = auth.uid())
);
create policy "installers update assigned lead stage notes" on public.leads for update using (
  assigned_installer_id in (select id from public.installers where user_id = auth.uid())
);
create policy "admins manage leads" on public.leads for all using (public.is_admin()) with check (public.is_admin());

create policy "public can submit installer applications" on public.installer_applications for insert with check (true);
create policy "admins manage applications" on public.installer_applications for all using (public.is_admin()) with check (public.is_admin());

create policy "installers read own documents" on public.documents for select using (
  installer_id in (select id from public.installers where user_id = auth.uid())
);
create policy "installers upload own documents" on public.documents for insert with check (
  installer_id in (select id from public.installers where user_id = auth.uid())
);
create policy "admins manage documents" on public.documents for all using (public.is_admin()) with check (public.is_admin());

create policy "public can read approved reviews" on public.reviews for select using (approved = true);
create policy "admins manage reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.territories, public.installers, public.installer_territories, public.reviews to anon, authenticated;
grant insert on public.leads, public.installer_applications to anon, authenticated;
grant select, update, insert on public.documents to authenticated;
grant select, update on public.leads to authenticated;
grant select, update on public.installers to authenticated;
grant all on all tables in schema public to service_role;
