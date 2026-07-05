create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  excerpt text not null,
  content text not null,
  image_url text not null,
  image_alt text not null,
  image_accent text not null default 'bg-[#2F9CFA]',
  image_label text,
  category_id text not null
    constraint blog_posts_category_id_check
    check (category_id in ('connection', 'philosophy', 'privacy', 'product')),
  category_label text not null,
  pillar_slug text,
  status text not null default 'draft'
    constraint blog_posts_status_check
    check (status in ('draft', 'published')),
  featured boolean not null default false,
  read_time_minutes integer,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_unique unique (slug),
  constraint blog_posts_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blog_posts_slug_length
    check (char_length(slug) between 3 and 120),
  constraint blog_posts_title_length
    check (char_length(title) between 3 and 200),
  constraint blog_posts_excerpt_length
    check (char_length(excerpt) between 20 and 500),
  constraint blog_posts_content_length
    check (char_length(content) between 100 and 50000),
  constraint blog_posts_image_alt_length
    check (char_length(image_alt) between 3 and 200)
);

create index blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc nulls last);

create index blog_posts_category_id_idx
  on public.blog_posts (category_id);

create index blog_posts_pillar_slug_idx
  on public.blog_posts (pillar_slug)
  where pillar_slug is not null;

create or replace function public.handle_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row
  execute function public.handle_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

create policy "Published blog posts are public"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published');
