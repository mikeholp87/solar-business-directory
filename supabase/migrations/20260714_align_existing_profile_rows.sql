do $$
declare
  profile_record record;
begin
  for profile_record in
    select
      p.id as profile_id,
      au.id as auth_user_id,
      lower(p.email) as email
    from public.users p
    join auth.users au
      on lower(au.email) = lower(p.email)
    where p.id <> au.id
  loop
    update public.installers
      set user_id = profile_record.auth_user_id
      where user_id = profile_record.profile_id;

    update public.audit_logs
      set actor_user_id = profile_record.auth_user_id
      where actor_user_id = profile_record.profile_id;

    update public.users
      set id = profile_record.auth_user_id,
          email = profile_record.email
      where id = profile_record.profile_id;
  end loop;
end;
$$;
