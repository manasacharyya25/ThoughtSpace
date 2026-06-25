create table public.board_rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  constraint board_rooms_slug_format check (slug ~ '^[a-z0-9-]+$')
);

create table public.board_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.board_rooms (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  constraint board_messages_content_length check (char_length(content) between 1 and 500)
);

create index board_messages_room_created_idx
  on public.board_messages (room_id, created_at desc);

insert into public.board_rooms (slug, name, description)
values (
  'common',
  'The Common Room',
  'An open space for anonymous minds to talk together.'
);

alter table public.board_rooms enable row level security;
alter table public.board_messages enable row level security;

create policy "Board rooms are viewable by authenticated users"
  on public.board_rooms for select
  to authenticated
  using (true);

create policy "Board messages are viewable by authenticated users"
  on public.board_messages for select
  to authenticated
  using (true);

create policy "Users can send board messages"
  on public.board_messages for insert
  to authenticated
  with check (auth.uid() = sender_id);

alter publication supabase_realtime add table public.board_messages;
