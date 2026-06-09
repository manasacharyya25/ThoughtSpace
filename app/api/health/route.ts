import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: env.NEXT_PUBLIC_APP_NAME,
    timestamp: new Date().toISOString(),
  });
}
