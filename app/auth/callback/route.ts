import { NextResponse } from "next/server";
import { hasProfile, markProfileRegistered } from "@/lib/supabase/profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profileExists = await hasProfile(supabase, user.id);

        if (profileExists && !user.is_anonymous) {
          await markProfileRegistered(supabase, user.id);
        }

        const next =
          requestedNext && !profileExists && requestedNext !== "/feed"
            ? requestedNext
            : profileExists
              ? "/feed"
              : "/onboarding";
        return NextResponse.redirect(`${origin}${next}`);
      }

      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
