import type { Metadata } from "next";
import { ReflectHub } from "@/components/reflect/reflect-hub";

export const metadata: Metadata = {
  title: "Reflect",
  description: "Private stream-of-consciousness journaling with markers.",
};

export default function ReflectPage() {
  return <ReflectHub />;
}
