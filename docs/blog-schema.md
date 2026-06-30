# Blog posts schema (admin app reference)

Table: `public.blog_posts`

Use the **Supabase service role key** for inserts/updates from your admin app. The public site reads published posts via anon key (RLS).

## Columns

| Column | Type | Required | Notes |
|--------|------|----------|-------|
| `id` | uuid | auto | Primary key |
| `slug` | text | yes | URL: `/blog/{slug}`. Lowercase, hyphens. Unique. |
| `title` | text | yes | Article header (3–200 chars) |
| `excerpt` | text | yes | SEO + cards (20–500 chars) |
| `content` | text | yes | Body. Use `\n\n` between paragraphs (100–50000 chars) |
| `image_url` | text | yes | Hero image URL or path e.g. `/blog/photo.jpg` |
| `image_alt` | text | yes | Accessibility (3–200 chars) |
| `image_accent` | text | no | Tailwind class, default `bg-[#2F9CFA]` |
| `image_label` | text | no | Card badge e.g. `Dialogue` |
| `category_id` | text | yes | `connection` \| `philosophy` \| `privacy` \| `product` |
| `category_label` | text | yes | Display label e.g. `Connection` |
| `pillar_slug` | text | no | SEO pillar slug e.g. `anonymous-chat` |
| `status` | text | yes | `draft` \| `published` (only published is public) |
| `featured` | boolean | no | default `false` |
| `read_time_minutes` | integer | no | e.g. `6` → UI shows "6 min read" |
| `published_at` | timestamptz | on publish | Set when `status = published` |
| `created_at` | timestamptz | auto | |
| `updated_at` | timestamptz | auto | |

## RLS

- **SELECT** (anon + authenticated): `status = 'published'`
- **INSERT/UPDATE/DELETE**: service role only (bypasses RLS) unless you add admin policies later

## Create draft

```sql
insert into public.blog_posts (
  slug, title, excerpt, content,
  image_url, image_alt, image_accent, image_label,
  category_id, category_label, pillar_slug,
  status, featured, read_time_minutes
) values (
  'my-new-article',
  'My Article Title',
  'A short summary for search engines and list cards.',
  'First paragraph here.

Second paragraph here.',
  'https://example.com/image.jpg',
  'Description of the image',
  'bg-[#2F9CFA]',
  'Dialogue',
  'connection',
  'Connection',
  'anonymous-chat',
  'draft',
  false,
  5
);
```

## Publish

```sql
update public.blog_posts
set
  status = 'published',
  published_at = coalesce(published_at, now())
where slug = 'my-new-article';
```

## JSON example (admin API body)

```json
{
  "slug": "why-anonymous-chat-matters",
  "title": "Why Anonymous Chat Matters",
  "excerpt": "Anonymous chat removes performance pressure so honest dialogue can begin.",
  "content": "Paragraph one.\n\nParagraph two.",
  "image_url": "/blog/anonymous-conversation.jpg",
  "image_alt": "Two people in conversation",
  "image_accent": "bg-[#2F9CFA]",
  "image_label": "Dialogue",
  "category_id": "connection",
  "category_label": "Connection",
  "pillar_slug": "anonymous-chat",
  "status": "published",
  "featured": false,
  "read_time_minutes": 6,
  "published_at": "2026-03-20T12:00:00Z"
}
```

## Seed existing articles

After running migrations:

```bash
npm run seed:blog
```

Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

Migration file: `supabase/migrations/20250626000011_blog_posts.sql`
