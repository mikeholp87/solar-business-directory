create or replace function public.handle_new_auth_user()
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
