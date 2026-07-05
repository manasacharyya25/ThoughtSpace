create table public.journal_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  content_json jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  plain_text text,
  status text not null default 'draft'
    check (status in ('draft', 'completed')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journal_markers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.journal_sessions (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null
    check (type in ('insight', 'todo', 'grateful', 'reminder')),
  text text not null,
  mark_id text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint journal_markers_session_mark_id_unique unique (session_id, mark_id)
);

create index journal_sessions_user_created_idx
  on public.journal_sessions (user_id, created_at desc);

create index journal_markers_user_type_created_idx
  on public.journal_markers (user_id, type, created_at desc);

create index journal_markers_session_idx
  on public.journal_markers (session_id);

alter table public.journal_sessions enable row level security;
alter table public.journal_markers enable row level security;

create policy "Users can view own journal sessions"
  on public.journal_sessions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own journal sessions"
  on public.journal_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own journal sessions"
  on public.journal_sessions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own journal sessions"
  on public.journal_sessions for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can view own journal markers"
  on public.journal_markers for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own journal markers"
  on public.journal_markers for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own journal markers"
  on public.journal_markers for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own journal markers"
  on public.journal_markers for delete
  to authenticated
  using (auth.uid() = user_id);
