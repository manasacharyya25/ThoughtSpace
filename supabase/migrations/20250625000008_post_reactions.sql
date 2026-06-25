create table public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  constraint post_reactions_emoji_length check (char_length(emoji) between 1 and 32),
  constraint post_reactions_unique_user_post unique (post_id, user_id)
);

create index post_reactions_post_id_idx on public.post_reactions (post_id);

alter table public.post_reactions enable row level security;

create policy "Post reactions are viewable by authenticated users"
  on public.post_reactions for select
  to authenticated
  using (true);

create policy "Users can insert own post reactions"
  on public.post_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own post reactions"
  on public.post_reactions for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete own post reactions"
  on public.post_reactions for delete
  to authenticated
  using (auth.uid() = user_id);
