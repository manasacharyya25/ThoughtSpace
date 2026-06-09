import type { Metadata } from "next";
import { InboxPage } from "./inbox-page";

export const metadata: Metadata = {
  title: "Inbox",
};

export default function InboxRoute() {
  return <InboxPage />;
}
