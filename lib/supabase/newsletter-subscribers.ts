import type { SupabaseClient } from "@supabase/supabase-js";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function subscribeToNewsletter(
  supabase: SupabaseClient,
  rawEmail: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const email = normalizeEmail(rawEmail);

  if (!email) {
    return { ok: false, error: "Enter your email address." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email,
  });

  if (error) {
    // Unique violation — already subscribed; treat as success
    if (error.code === "23505") {
      return { ok: true };
    }

    return { ok: false, error: error.message || "Could not subscribe. Try again." };
  }

  return { ok: true };
}
