import type { ButtonHTMLAttributes } from "react";
import { Loading } from "./Loading";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string;
  loading?: boolean;
};

export function Button({
  icon,
  children,
  loading = false,
  type = "button",
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loading size="sm" label="" /> : null}
      {!loading && icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}
