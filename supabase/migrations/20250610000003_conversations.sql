create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null unique references public.responses (id) on delete cascade,
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  responder_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  constraint messages_content_length check (char_length(content) between 1 and 2000)
);

create index conversations_author_id_idx on public.conversations (author_id);
create index conversations_responder_id_idx on public.conversations (responder_id);
create index conversations_last_message_at_idx on public.conversations (last_message_at desc);
create index messages_conversation_id_created_idx on public.messages (conversation_id, created_at asc);

create or replace function public.bump_conversation_last_message_at()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_bump_conversation_last_message
  after insert on public.messages
  for each row
  execute function public.bump_conversation_last_message_at();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Participants can read conversations"
  on public.conversations for select
  to authenticated
  using (auth.uid() in (author_id, responder_id));

create policy "Post author can create conversation"
  on public.conversations for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Participants can read messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and auth.uid() in (c.author_id, c.responder_id)
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1
      from public.conversations c
      where c.id = conversation_id
        and auth.uid() in (c.author_id, c.responder_id)
    )
  );
