-- Public read access for published newsletters (webapp /newsletters + /newsletter/[id])
-- Admin continues to use service role for full CRUD.

alter table public.newsletters enable row level security;

drop policy if exists "Published newsletters are publicly readable"
  on public.newsletters;

create policy "Published newsletters are publicly readable"
  on public.newsletters for select
  to anon, authenticated
  using (status = 'published');
