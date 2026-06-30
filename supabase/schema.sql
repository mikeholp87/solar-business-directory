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
  company_name text,
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
  best_time_to_contact text,
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

create type territory_request_status as enum ('pending', 'approved', 'rejected');

create table public.territory_requests (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references public.installers(id) on delete cascade,
  territory_id uuid not null references public.territories(id) on delete cascade,
  notes text,
  status territory_request_status not null default 'pending',
  requested_at timestamptz not null default now()
);

create type notification_channel as enum ('email', 'sms', 'in_app');
create type notification_status as enum ('queued', 'sent', 'failed');

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  channel notification_channel not null default 'email',
  recipient_email text,
  recipient_role user_role,
  subject text not null,
  body text not null,
  payload jsonb not null default '{}'::jsonb,
  status notification_status not null default 'queued',
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  actor_role user_role,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists installers_company_name_idx on public.installers (company_name);
create index if not exists installers_user_id_idx on public.installers (user_id);
create index if not exists installers_status_verified_company_name_idx on public.installers (company_name) where status = 'active' and accreditations_verified = true;
create index if not exists installers_stripe_customer_id_idx on public.installers (stripe_customer_id) where stripe_customer_id is not null;
create index if not exists installers_stripe_subscription_id_idx on public.installers (stripe_subscription_id) where stripe_subscription_id is not null;
create index if not exists installers_company_name_lower_idx on public.installers (lower(company_name));
create index if not exists installers_email_lower_idx on public.installers (lower(email));
create index if not exists installers_mcs_number_lower_idx on public.installers (lower(coalesce(mcs_number, '')));
create index if not exists installers_services_gin_idx on public.installers using gin (services);
create index if not exists installers_areas_covered_gin_idx on public.installers using gin (areas_covered);

create index if not exists installer_territories_installer_status_idx on public.installer_territories (installer_id, status);
create index if not exists installer_territories_territory_status_idx on public.installer_territories (territory_id, status);

create index if not exists leads_assigned_installer_id_created_at_idx on public.leads (assigned_installer_id, created_at desc);
create index if not exists leads_territory_id_idx on public.leads (territory_id);
create index if not exists leads_stage_idx on public.leads (stage);

create index if not exists installer_applications_status_created_at_idx on public.installer_applications (status, created_at desc);
create index if not exists documents_installer_id_uploaded_at_idx on public.documents (installer_id, uploaded_at desc);
create index if not exists reviews_installer_id_approved_created_at_idx on public.reviews (installer_id, approved, created_at desc);
create index if not exists territory_requests_installer_status_requested_at_idx on public.territory_requests (installer_id, status, requested_at desc);
create index if not exists notification_outbox_status_created_at_idx on public.notification_outbox (status, created_at desc);
create index if not exists notification_outbox_recipient_role_status_idx on public.notification_outbox (recipient_role, status, created_at desc);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

create or replace function public.search_directory_installers(
  search_query text default null,
  service_type text default null,
  bus_only boolean default false,
  website_only boolean default false,
  email_only boolean default false,
  sort_option text default 'relevance',
  page_number integer default 1,
  page_size integer default 15
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
with args as (
  select
    nullif(btrim(lower(search_query)), '') as query_term,
    nullif(btrim(service_type), '') as service_term,
    greatest(coalesce(page_number, 1), 1) as requested_page,
    greatest(coalesce(page_size, 15), 1) as per_page,
    case when sort_option in ('relevance', 'name', 'type') then sort_option else 'relevance' end as sort_term
),
filtered as (
  select
    i.id as installer_uuid,
    i.company_name,
    i.slug,
    i.email,
    i.phone,
    i.website,
    i.description,
    i.mcs_number,
    i.bus_registered,
    i.services,
    i.areas_covered
  from public.installers i
  cross join args a
  where
    (a.query_term is null or (
      lower(i.company_name) like '%' || a.query_term || '%' or
      lower(coalesce(i.description, '')) like '%' || a.query_term || '%' or
      lower(coalesce(i.mcs_number, '')) like '%' || a.query_term || '%' or
      lower(i.email) like '%' || a.query_term || '%' or
      lower(coalesce(i.phone, '')) like '%' || a.query_term || '%' or
      lower(coalesce(i.website, '')) like '%' || a.query_term || '%' or
      exists (
        select 1
        from jsonb_array_elements_text(coalesce(i.services, '[]'::jsonb)) as service_value(value)
        where lower(service_value.value) like '%' || a.query_term || '%'
      ) or
      exists (
        select 1
        from jsonb_array_elements_text(coalesce(i.areas_covered, '[]'::jsonb)) as area_value(value)
        where lower(area_value.value) like '%' || a.query_term || '%'
      )
    ))
    and (
      a.service_term is null or exists (
        select 1
        from (
          values
            ('Air Source Heat Pump', array['air source heat pump', 'air source heat pumps']::text[]),
            ('Ground/Water Source Heat Pump', array['ground source heat pump', 'ground source heat pumps', 'water source heat pump', 'water source heat pumps', 'ground/water source heat pump', 'ground/water source heat pumps']::text[]),
            ('Solar PV', array['solar pv']::text[]),
            ('Battery Storage', array['battery storage']::text[]),
            ('Biomass', array['biomass']::text[]),
            ('Technical surveys', array['technical surveys']::text[]),
            ('Heat loss calculations', array['heat loss calculations']::text[])
        ) as service_map(label, aliases)
        where lower(service_map.label) = a.service_term
          and exists (
            select 1
            from jsonb_array_elements_text(coalesce(i.services, '[]'::jsonb)) as service_value(value)
            where exists (
              select 1
              from unnest(service_map.aliases) as alias(value)
              where lower(service_value.value) like '%' || lower(alias.value) || '%'
            )
          )
      )
    )
    and (not bus_only or i.bus_registered)
    and (not website_only or nullif(btrim(coalesce(i.website, '')), '') is not null)
    and (not email_only or nullif(btrim(i.email), '') is not null)
),
stats as (
  select count(*)::int as total_count from filtered
),
ranked as (
  select
    f.*,
    s.total_count,
    row_number() over (
      order by
        case
          when a.sort_term = 'name' then null
          when a.sort_term = 'type' then null
          when a.query_term is null then 0
          when lower(f.company_name) = a.query_term then 0
          when lower(f.company_name) like a.query_term || '%' then 1
          when lower(f.company_name) like '%' || a.query_term || '%' then 2
          when lower(coalesce(f.description, '')) like '%' || a.query_term || '%' then 3
          when lower(coalesce(f.mcs_number, '')) like '%' || a.query_term || '%' then 4
          when lower(f.email) like '%' || a.query_term || '%' then 5
          when lower(coalesce(f.phone, '')) like '%' || a.query_term || '%' then 6
          else 7
        end,
        lower(f.company_name),
        f.slug
    ) as relevance_rank,
    row_number() over (
      order by
        lower(f.company_name),
        f.slug
    ) as name_rank,
    row_number() over (
      order by
        coalesce((select string_agg(value, ' / ' order by value) from jsonb_array_elements_text(coalesce(f.services, '[]'::jsonb)) as service_value(value)), ''),
        lower(f.company_name),
        f.slug
    ) as type_rank
  from filtered f
  cross join stats s
  cross join args a
),
bounds as (
  select
    total_count,
    per_page,
    greatest(1, least(requested_page, greatest(ceil(total_count::numeric / per_page)::int, 1))) as safe_page,
    sort_term
  from stats
  cross join args
)
select jsonb_build_object(
  'total_count', coalesce((select total_count from bounds), 0),
  'installers', coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'installer_id', null,
          'company_name', r.company_name,
          'slug', r.slug,
          'email', r.email,
          'phone', r.phone,
          'website', r.website,
          'description', r.description,
          'mcs_installer_id', null,
          'mcs_number', r.mcs_number,
          'certification_body', null,
          'bus_registered', r.bus_registered,
          'services', r.services,
          'areas_covered', r.areas_covered,
          'address_line1', null,
          'address_line2', null,
          'address_line3', null,
          'address_county', null,
          'address_postcode', null,
          'address_country', null,
          'source_page', null,
          'category', r.services,
          'regions_covered', r.areas_covered,
          'type', r.services
        )
        order by
          case (select sort_term from bounds)
            when 'name' then r.name_rank
            when 'type' then r.type_rank
            else r.relevance_rank
          end
      )
      from ranked r
      cross join bounds b
      where r.name_rank > 0
        and r.relevance_rank > 0
        and (
          case b.sort_term
            when 'name' then r.name_rank
            when 'type' then r.type_rank
            else r.relevance_rank
          end
        ) > ((b.safe_page - 1) * b.per_page)
        and (
          case b.sort_term
            when 'name' then r.name_rank
            when 'type' then r.type_rank
            else r.relevance_rank
          end
        ) <= (b.safe_page * b.per_page)
    ),
    '[]'::jsonb
  )
);
$$;

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role_value user_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'installer');
  company_name_value text := nullif(new.raw_user_meta_data->>'company_name', '');
  installer_slug_value text := nullif(new.raw_user_meta_data->>'installer_slug', '');
  existing_user_id uuid;
  existing_user_role user_role;
  existing_company_name text;
begin
  select id, role, company_name
  into existing_user_id, existing_user_role, existing_company_name
  from public.users
  where email = lower(new.email)
  limit 1;

  if found then
    update public.installers
      set user_id = new.id
      where user_id = existing_user_id;

    update public.audit_logs
      set actor_user_id = new.id
      where actor_user_id = existing_user_id;

    update public.users
      set id = new.id,
          email = lower(new.email),
          role = coalesce(existing_user_role, user_role_value),
          company_name = coalesce(existing_company_name, company_name_value)
      where id = existing_user_id;
  else
    insert into public.users (id, email, role, company_name)
    values (
      new.id,
      lower(new.email),
      user_role_value,
      company_name_value
    )
    on conflict (id) do update
      set email = excluded.email,
          role = excluded.role,
          company_name = excluded.company_name;
  end if;

  if user_role_value = 'installer' then
    insert into public.installers (
      user_id,
      company_name,
      slug,
      contact_name,
      email,
      status,
      subscription_status,
      bus_registered,
      accreditations_verified
    )
    select
      new.id,
      coalesce(company_name_value, split_part(new.email, '@', 1)),
      coalesce(installer_slug_value, regexp_replace(lower(coalesce(company_name_value, split_part(new.email, '@', 1))), '[^a-z0-9]+', '-', 'g') || '-' || substr(new.id::text, 1, 8)),
      coalesce(company_name_value, split_part(new.email, '@', 1)),
      lower(new.email),
      'pending',
      'trialing',
      false,
      false
    where not exists (
      select 1
      from public.installers
      where user_id = new.id
    );
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_auth_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

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

create policy "users read own profile" on public.users for select using ((select auth.uid()) = id);
create policy "admins manage users" on public.users for all using (public.is_admin()) with check (public.is_admin());
alter table public.territories enable row level security;
alter table public.installer_territories enable row level security;
alter table public.leads enable row level security;
alter table public.installer_applications enable row level security;
alter table public.documents enable row level security;
alter table public.reviews enable row level security;
alter table public.territory_requests enable row level security;
alter table public.notification_outbox enable row level security;
alter table public.audit_logs enable row level security;

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

create policy "installers read own territory requests" on public.territory_requests for select using (
  installer_id in (select id from public.installers where user_id = auth.uid())
);
create policy "installers create own territory requests" on public.territory_requests for insert with check (
  installer_id in (select id from public.installers where user_id = auth.uid())
);
create policy "admins manage territory requests" on public.territory_requests for all using (public.is_admin()) with check (public.is_admin());

create policy "admins manage notification outbox" on public.notification_outbox for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage audit logs" on public.audit_logs for all using (public.is_admin()) with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.territories, public.installers, public.installer_territories, public.reviews to anon, authenticated;
grant insert on public.leads, public.installer_applications to anon, authenticated;
grant select, update, insert on public.documents to authenticated;
grant select, update on public.leads to authenticated;
grant select, update on public.installers to authenticated;
grant select, insert on public.territory_requests to authenticated;
grant select, insert, update on public.notification_outbox to service_role;
grant select, insert on public.audit_logs to service_role;
grant all on all tables in schema public to service_role;
