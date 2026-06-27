import type { Metadata } from "next";
import { InboxPage } from "../inbox-page";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Private, one-to-one conversations.",
};

export default function InboxRoute() {
  return <InboxPage />;
}
