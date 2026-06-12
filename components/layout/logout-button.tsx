"use client";

import { useUser } from "@/hooks/use-user";
import { useLogout } from "@/hooks/use-logout";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const { user, loading } = useUser();
  const { logout, signingOut } = useLogout();

  if (loading || !user) return null;

  return (
    <button
      type="button"
      onClick={logout}
      disabled={signingOut}
      aria-label="Log out"
      title="Log out"
      className={cn(
        "fixed z-50 hidden h-11 w-11 items-center justify-center rounded-full md:flex",
        "border border-transparent bg-accent text-accent-foreground shadow-2xl shadow-black/40",
        "soft-interactive transition-[background-color,border-color,color] duration-300 ease",
        "hover:bg-accent/90 hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <LogOutIcon className="h-5 w-5" />
    </button>
  );
}
