alter table public.profiles
  add column if not exists account_status text not null default 'registered'
  constraint profiles_account_status_check
    check (account_status in ('anonymous', 'registered'));

update public.profiles
set account_status = 'registered'
where account_status is distinct from 'registered';
