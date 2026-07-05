create policy "Participants can delete conversations"
  on public.conversations for delete
  to authenticated
  using (auth.uid() in (author_id, responder_id));
