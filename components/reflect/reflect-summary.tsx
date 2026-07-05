import { getMarkerTypeLabel } from "@/lib/reflect/marker-labels";
import { summarizeSessionMarkers } from "@/lib/reflect/summarize-session";
import { cn } from "@/lib/utils";
import type { JournalMarker } from "@/types/journal";

interface ReflectSummaryProps {
  markers: JournalMarker[];
  className?: string;
}

export function ReflectSummary({ markers, className }: ReflectSummaryProps) {
  const sections = summarizeSessionMarkers(markers);

  if (sections.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/80 px-4 py-5 text-sm text-[#1C1D1E]/55",
          className
        )}
      >
        No markers captured in this session.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {sections.map((section) => (
        <section
          key={section.type}
          className="rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/85 px-4 py-4"
        >
          <h2 className="mb-3 text-sm font-semibold text-[#1C1D1E]">
            {section.label}
          </h2>
          <ul className="space-y-2">
            {section.markers.map((marker) => (
              <li
                key={marker.id}
                className="flex items-start gap-2 text-sm leading-relaxed text-[#1C1D1E]/80"
              >
                <span
                  className={cn("marker-pill shrink-0", `marker-pill--${section.type}`)}
                >
                  {getMarkerTypeLabel(section.type)}
                </span>
                <span className={cn(marker.completed && "line-through opacity-60")}>
                  {marker.text}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
