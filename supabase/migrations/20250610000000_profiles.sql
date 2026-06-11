create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  age_range text not null,
  gender text not null,
  gender_custom text,
  country text not null,
  bio text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) between 3 and 20),
  constraint profiles_username_format check (username ~ '^[a-zA-Z0-9_]+$'),
  constraint profiles_bio_length check (char_length(bio) between 10 and 150)
);

create unique index profiles_username_lower_idx on public.profiles (lower(username));

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_profiles_updated_at();
