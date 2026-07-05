-- Rich blog content: plain (default) or TipTap JSON
alter table public.blog_posts
  add column if not exists content_format text not null default 'plain'
    constraint blog_posts_content_format_check
    check (content_format in ('plain', 'tiptap'));

alter table public.blog_posts
  add column if not exists content_json jsonb;

alter table public.blog_posts
  add constraint blog_posts_content_json_check
  check (
    (content_format = 'plain' and content_json is null)
    or (content_format = 'tiptap' and content_json is not null)
  );

create index if not exists blog_posts_content_format_idx
  on public.blog_posts (content_format);
