interface InboxEmptyProps {
  message: string;
}

export function InboxEmpty({ message }: InboxEmptyProps) {
  return (
    <div className="rounded-xl border border-dashed border-border/30 px-6 py-10 text-center">
      <p className="text-[13px] text-muted-foreground/60">{message}</p>
    </div>
  );
}
