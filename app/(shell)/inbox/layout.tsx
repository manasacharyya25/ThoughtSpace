"use client";

import { InboxProvider } from "@/context/inbox-context";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InboxProvider>{children}</InboxProvider>;
}
