import type { Metadata } from "next";
import { ProfileContent } from "./profile-content";

export const metadata: Metadata = {
  title: "Profile",
  description: "Your sanctuary identity and account.",
};

export default function ProfilePage() {
  return <ProfileContent />;
}
