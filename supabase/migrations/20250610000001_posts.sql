create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  category text not null,
  created_at timestamptz not null default now(),
  constraint posts_content_length check (char_length(content) between 10 and 500),
  constraint posts_category_length check (char_length(category) between 2 and 30)
);

create index posts_created_at_idx on public.posts (created_at desc);
create index posts_category_idx on public.posts (category);

alter table public.posts enable row level security;

create policy "Posts are viewable by authenticated users"
  on public.posts for select
  to authenticated
  using (true);

create policy "Users can insert own posts"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update own posts"
  on public.posts for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Users can delete own posts"
  on public.posts for delete
  to authenticated
  using (auth.uid() = author_id);
