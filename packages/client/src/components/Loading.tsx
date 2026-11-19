type LoadingProps = {
  label?: string;
  size?: "sm" | "md";
};

export function Loading({ label = "Loading…", size = "md" }: LoadingProps) {
  return (
    <span
      className={`loading loading-${size}`}
      role="status"
      aria-live="polite"
    >
      <span className="loading-mark" aria-hidden="true" />
      {label ? <span>{label}</span> : null}
    </span>
  );
}
