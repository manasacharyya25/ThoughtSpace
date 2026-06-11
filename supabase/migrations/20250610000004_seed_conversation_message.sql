create or replace function public.seed_conversation_from_response()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  response_content text;
  response_responder uuid;
begin
  select content, responder_id
  into response_content, response_responder
  from public.responses
  where id = new.response_id;

  insert into public.messages (conversation_id, sender_id, content)
  values (new.id, response_responder, response_content);

  return new;
end;
$$;

create trigger conversations_seed_message
  after insert on public.conversations
  for each row
  execute function public.seed_conversation_from_response();
