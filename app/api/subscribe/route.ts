import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { subscribeToNewsletter } from "@/lib/supabase/newsletter-subscribers";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email
      : "";

  const supabase = createPublicClient();
  const result = await subscribeToNewsletter(supabase, email);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
