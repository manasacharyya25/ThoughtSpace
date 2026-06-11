"use client";

import { useEffect, useState } from "react";
import { getProfileByUserId } from "@/lib/supabase/profiles";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";
import { useUser } from "./use-user";

export function useProfile() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(undefined);

    const supabase = createClient();
    getProfileByUserId(supabase, user.id).then((result) => {
      if (cancelled) return;
      setProfile(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user, userLoading]);

  return {
    profile,
    loading: userLoading || loading,
    error,
  };
}
