alter table public.posts
  drop constraint if exists posts_content_length;

alter table public.posts
  add constraint posts_content_length
  check (char_length(content) between 10 and 3000);
