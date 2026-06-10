interface ResponseSuccessProps {
  title?: string;
  description?: string;
}

export function ResponseSuccess({
  title = "Response sent privately",
  description = "Your words were delivered. Only you and the author will see this conversation.",
}: ResponseSuccessProps = {}) {
  return (
    <div className="response-success-animate flex flex-col items-center py-8 text-center">
      <div className="response-check-animate flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7 text-emerald-400"
          aria-hidden="true"
        >
          <path d="M5 13l4 4L19 7" className="response-check-path" />
        </svg>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
