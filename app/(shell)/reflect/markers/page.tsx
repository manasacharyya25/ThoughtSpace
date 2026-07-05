import type { Metadata } from "next";
import { ReflectMarkersList } from "@/components/reflect/reflect-markers-list";
import { ReflectSubNav } from "@/components/reflect/reflect-sub-nav";

export const metadata: Metadata = {
  title: "Markers",
  description: "All insights, todos, and markers from your reflections.",
};

export default function ReflectMarkersPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C1D1E]">
          Reflect
        </h1>
        <p className="mt-1 text-sm text-[#1C1D1E]/50">
          Only you can see your reflections.
        </p>
      </header>

      <ReflectSubNav />
      <ReflectMarkersList />
    </div>
  );
}
