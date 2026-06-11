"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useLogout() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const logout = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return { logout, signingOut };
}
