alter table public.posts
  add column if not exists response_count integer not null default 0;

create table public.responses (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  responder_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  constraint responses_one_per_user_per_post unique (post_id, responder_id),
  constraint responses_content_length check (char_length(content) between 30 and 8000)
);

create index responses_post_id_idx on public.responses (post_id);
create index responses_responder_id_idx on public.responses (responder_id);
create index responses_status_created_idx on public.responses (status, created_at desc);
create index posts_response_count_idx on public.posts (response_count asc, created_at desc);

create or replace function public.bump_post_response_count()
returns trigger
language plpgsql
as $$
begin
  update public.posts
  set response_count = response_count + 1
  where id = new.post_id;
  return new;
end;
$$;

create trigger responses_bump_post_count
  after insert on public.responses
  for each row
  execute function public.bump_post_response_count();

alter table public.responses enable row level security;

create policy "Users can insert responses to others posts"
  on public.responses for insert
  to authenticated
  with check (
    auth.uid() = responder_id
    and not exists (
      select 1
      from public.posts p
      where p.id = post_id and p.author_id = auth.uid()
    )
  );

create policy "Responder or post author can read response"
  on public.responses for select
  to authenticated
  using (
    auth.uid() = responder_id
    or exists (
      select 1
      from public.posts p
      where p.id = post_id and p.author_id = auth.uid()
    )
  );

create policy "Post author can update response status"
  on public.responses for update
  to authenticated
  using (
    exists (
      select 1
      from public.posts p
      where p.id = post_id and p.author_id = auth.uid()
    )
  )
  with check (status in ('pending', 'accepted', 'declined'));
