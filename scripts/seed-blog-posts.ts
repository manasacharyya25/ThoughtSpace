import { createClient } from "@supabase/supabase-js";
import { BLOG_POSTS } from "../data/blog-posts-static";
import { blogPostToInsert } from "../lib/blog-mapper";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedBlogPosts() {
  const rows = BLOG_POSTS.map(blogPostToInsert);

  const { data, error } = await supabase
    .from("blog_posts")
    .upsert(rows, { onConflict: "slug" })
    .select("slug");

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${data?.length ?? 0} blog posts.`);
}

seedBlogPosts();
