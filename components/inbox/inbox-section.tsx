interface InboxSectionProps {
  title: string;
  count?: number;
  description?: string;
  children: React.ReactNode;
}

export function InboxSection({
  title,
  count,
  description,
  children,
}: InboxSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-medium tracking-wide text-foreground/80">
            {title}
          </h2>
          {count !== undefined && (
            <span className="text-[11px] text-muted-foreground/60">
              {count}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[13px] text-muted-foreground/70">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
