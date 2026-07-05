import type { Metadata } from "next";
import { ReflectSessionPage } from "@/components/reflect/reflect-session-page";

export const metadata: Metadata = {
  title: "Reflect Session",
  description: "Write and review your private reflection session.",
};

interface ReflectSessionRouteProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ReflectSessionRoute({
  params,
}: ReflectSessionRouteProps) {
  const { sessionId } = await params;
  return <ReflectSessionPage sessionId={sessionId} />;
}
