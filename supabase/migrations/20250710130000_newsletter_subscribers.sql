-- Newsletter email subscribers (public /subscribe form)

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_format
    check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe with email"
  on public.newsletter_subscribers;

create policy "Anyone can subscribe with email"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);
