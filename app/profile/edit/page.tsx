import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import { ProfileEditFlow } from "@/components/profile";

const profileEditSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Update your profile and complete your sanctuary identity.",
  robots: { index: false, follow: false },
};

export default function ProfileEditPage() {
  return (
    <div className={`${profileEditSans.variable} min-h-dvh bg-[#FAF8F5]`}>
      <Suspense>
        <ProfileEditFlow />
      </Suspense>
    </div>
  );
}
